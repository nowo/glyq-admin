<template>
    <div class="upload-box" :class="`limit${props.limit}`">
        <el-upload v-if="props.type === 'text'" v-model:file-list="defData.uploadList" class="upload-text"
            :class="{ 'hide-upload': defData.hideUpload }" action="/" list-type="text" :limit="props.limit"
            :on-change="onImgChange" :auto-upload="false" :accept="props.accept" :multiple="props.multiple">
            <!--  :on-preview="onImgPreview" :on-remove="onImgRemove" -->
            <el-button type="primary" plain link>
                上传
            </el-button>
            <template #file="{ file }">
                <el-button type="primary" plain link @click="onImgPreview(file)">
                    查看
                </el-button>
                <el-button v-if="!props.readonly" type="info" link @click="removeImg(file)">
                    删除
                </el-button>
            </template>
        </el-upload>
        <el-upload v-else v-model:file-list="defData.uploadList" :class="{ 'hide-upload': defData.hideUpload }" action="/"
            list-type="picture-card" :limit="props.limit" :on-change="onImgChange" :auto-upload="false"
            :accept="props.accept" :multiple="props.multiple">
            <el-icon>
                <ele-Plus />
            </el-icon>
            <template #file="{ file }">
                <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="onImgPreview(file)">
                            <el-icon>
                                <ele-ZoomIn />
                            </el-icon>
                        </span>
                        <span v-if="!props.readonly" class="el-upload-list__item-delete" @click="removeImg(file)">
                            <el-icon>
                                <ele-Delete />
                            </el-icon>
                        </span>
                    </span>
                </div>
            </template>
        </el-upload>

        <el-image-viewer v-if="showImg.viewer" :url-list="showImg.list" :z-index="10000" :initial-index="showImg.index"
            teleported @close="closeView" />
        <el-dialog v-model="defData.videoVisible" width="600px" draggable append-to-body>
            <video class="h350px w100%" :src="defData.videoUrl" controls />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import type { UploadFile, UploadFiles } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { PropType } from 'vue'
import { computed, onMounted, reactive, watch } from 'vue'
import { CommonApi } from '@/api/common'

interface AllFileList {
    url: string // 服务器文件地址
    blob: string // 服务器文件地址或者是本地blob地址
}

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    limit: {
        type: Number,
        default: 1,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    accept: {
        type: String,
        default: 'image/*',
    },
    type: {
        type: String,
        default: 'picture-card',
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    char: { // 连接字符
        type: String,
        default: ';',
    },
    uploadType: {
        type: String as PropType<'img' | 'video'>,
        default: 'img',
    },
})
const emits = defineEmits<{
    (e: 'update:modelValue', param: string): void
}>()

const defData = reactive({
    ready: false,
    hideUpload: false,
    allFile: [] as AllFileList[], // 所有图片数组
    uploadList: [] as { name: string; url: string }[], // 已上传的图片
    deleteList: [] as string[], // 暂存需要删除的图片

    videoVisible: false,
    videoUrl: '',
})

const showImg = reactive({
    viewer: false,
    index: 0,
    list: computed(() => defData.allFile.map(item => item.url)), // 预览图片数组
})

const initData = () => {
    let imgArr = props.modelValue.split(props.char)
    if (!props.modelValue) imgArr = []
    defData.allFile = imgArr.map(item => ({ url: item, blob: item }))
    defData.uploadList = imgArr.map(item => ({ name: item, url: item }))

    defData.hideUpload = defData.uploadList.length >= props.limit
}

// 图片改变
const onImgChange = async (file: UploadFile, files: UploadFiles) => {
    if (files.length >= props.limit) defData.hideUpload = true

    // let formData = new FormData();
    // formData.append(file, file.raw)

    const res = await CommonApi.upload({ file: file.raw as File })
    if (res.code !== 200) return ElMessage.error(res.msg)

    defData.ready = true
    defData.allFile.push({
        url: res.data,
        blob: file.url as string,
    })
    defData.hideUpload = defData.uploadList.length >= props.limit

    emits('update:modelValue', listToStr(showImg.list))
}

// 文字类型，移除图片
const removeImg = (file: UploadFile) => {
    // 先找到删除数组列表图片中的那条数据
    const index = defData.allFile.map(item => item.blob).indexOf(file.url as string)
    if (index < 0) return

    // 先找到需要删除的那个地址
    const url = defData.allFile[index].url
    if (!defData.deleteList.includes(url)) defData.deleteList.push(url) // 暂存到删除列表中

    defData.allFile.splice(index, 1)
    defData.uploadList.splice(index, 1)

    defData.hideUpload = defData.uploadList.length >= props.limit

    emits('update:modelValue', listToStr(showImg.list))
}

// 图片删除
const onDeleteFile = async () => {
    if (!defData.deleteList.length) return
    // 删除已上传的图片
    Promise.all([
        defData.deleteList.map((item => CommonApi.delImg({ src: item }))),
    ])
    defData.deleteList = []
}

// 验证是否为视频格式
const isVideoFile = (url: string) => {
    // 用来验证视频的后缀，如果还有其它格式，可以往里面添加
    const video_suffix = ['avi', 'wmv', 'mpg', 'mpeg', 'mov', 'rm', 'ram', 'swf', 'flv', 'mp4', 'mp3', 'wma', 'avi', 'rm', 'rmvb', 'flv', 'mpg', 'mkv']
    // 获取文件后缀
    const extension = url?.match(/\.([^.?#]+)(\?|$|#)/)?.[1]
    // 防止出问题，把获取到的所有结尾格式，全部转化为小写
    const suffix = extension?.toLowerCase()

    if (suffix && video_suffix.includes(suffix)) return true
    return false
}

// 图片预览
const onImgPreview = (file: UploadFile) => {
    if (file.url && isVideoFile(file.url)) {
        defData.videoUrl = file.url
        defData.videoVisible = true
        return
    }

    // console.log(extension); // "png"

    // 先找到删除数组列表图片中的那条数据
    const index = defData.allFile.map(item => item.blob).indexOf(file.url as string)
    if (index < 0) return

    // 先找到需要删除的那个地址
    const url = defData.allFile[index].url
    const showIndex = showImg.list.indexOf(url as string)
    showImg.index = showIndex > -1 ? showIndex : 0
    showImg.viewer = true
}
// 关闭图片预览
const closeView = () => {
    showImg.viewer = false
}

// 数组转成字符串形式
const listToStr = (arr: any[], t = props.char) => {
    let url = ''
    arr.forEach((item: string, index) => {
        const symbol = index ? t : ''
        url += symbol + item
    })
    return url
}

// 首次加载只调用一次，例如修改，组件以加载，props传过来的值慢一点时
watch(() => props.modelValue, (newVal, oldVal) => {
    initData()
    // console.log('newVal :>> ', newVal);
    // if (defData.ready) return;
    // if (newVal && !oldVal) {
    //     initData()
    //     defData.ready = true;
    // }
})

// 监听视频预览弹窗，关闭时清除视频地址，避免弹窗关闭了还处于播放状态
watch(() => defData.videoVisible, (newVal) => {
    if (!newVal) defData.videoUrl = ''
})

onMounted(() => {
    initData()
})

defineExpose({
    onDeleteFile,
})
</script>

<style lang="scss" scoped>
.hide-upload {
    :deep() {
        .el-upload {
            display: none;
        }
    }
}

.upload-box {
    &.limit1 {
        :deep(.el-upload-list--picture-card) {

            display: block;

            .el-upload-list__item {
                margin: 0;
                display: flex;
            }
        }
    }

    :deep() {
        .el-icon--close-tip {
            display: none !important;
        }

        .el-upload-list__item.is-success:focus .el-upload-list__item-status-label,
        .el-upload-list__item.is-success:hover .el-upload-list__item-status-label {
            display: inline-flex;
            opacity: 1;
        }

        .upload-text {

            .el-upload-list--text {
                margin: 0;

                .el-upload-list__item {
                    margin: 0;
                }
            }

        }

    }
}
</style>
