<template>
    <div class="wang-editor-box">
        <Toolbar :editor="editorRef" :default-config="toolbarConfig" :mode="mode" class="wang-editor-tool" />
        <Editor v-model="valueHtml" :default-config="editorConfig" :mode="mode" style="height: 350px; overflow-y: hidden"
            @on-created="handleCreated" @on-change="handleChange" @on-destroyed="handleDestroyed" @on-focus="handleFocus"
            @on-blur="handleBlur" @custom-alert="customAlert" @custom-paste="customPaste" />
    </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IEditorConfig } from '@wangeditor/editor'
import { setSignRule } from '@/utils/http/crypto'
import { Session } from '@/utils/storage'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

// 子传父,定义方法
const emits = defineEmits(['update:modelValue'])

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

const valueHtml = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    },
})

// 内容 HTML
// const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//     }, 1500)
// })

const toolbarConfig = {}
const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',

    MENU_CONF: {},

}

const setTokenSign = () => {
    const token = Session.get('token')

    // 'x-sign': `${sign}-${time}`,
    const timestamp = Date.now()
    const sign = setSignRule(import.meta.env.VITE_SIGN_KEY, `${timestamp}`)
    return {
        'x-sign': `${sign}-${timestamp}`,
        'x-token': `${token}`,

    }
}

type InsertImageFnType = (url: string, alt: string, href: string) => void
type InsertVideoFnType = (url: string, poster: string) => void
// 配置上传图片
editorConfig.MENU_CONF!.uploadImage = {
    fieldName: 'file',
    server: '/api/common/upload',
    headers: setTokenSign(),
    // 自定义插入图片
    customInsert(res: any, insertFn: InsertImageFnType) { // TS 语法
        console.log(res)
        // customInsert(res, insertFn) {                  // JS 语法
        // res 即服务端的返回结果

        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(res.data, res.data, res.data)
    },
}

// 配置上传视频
editorConfig.MENU_CONF!.uploadVideo = {
    fieldName: 'file',
    server: '/api/common/upload',
    headers: setTokenSign(),
    // 自定义插入图片
    customInsert(res: any, insertFn: InsertVideoFnType) { // TS 语法
        console.log(res)
        // customInsert(res, insertFn) {                  // JS 语法
        // res 即服务端的返回结果

        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(res.data, res.data)
    },
}

const mode = ref('default')

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return

    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor)
    editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
    console.log('change:', editor.getHtml())
}
const handleDestroyed = (editor) => {
    console.log('destroyed', editor)
}
const handleFocus = (editor) => {
    console.log('focus', editor)
}
const handleBlur = (editor) => {
    console.log('blur', editor)
}
const customAlert = (info, type) => {
    alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event)

    // 自定义插入内容
    // editor.insertText('xxx')

    // 返回值（注意，vue 事件的返回值，不能用 return）
    // callback(false) // 返回 false ，阻止默认粘贴行为
    callback(true) // 返回 true ，继续默认的粘贴行为
}

const insertText = () => {
    const editor = editorRef.value
    if (editor == null) return

    editor.insertText('hello world')
}

const printHtml = () => {
    const editor = editorRef.value
    if (editor == null) return
    console.log(editor.getHtml())
}

const disable = () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.disable()
}
</script>

<style lang="scss" scoped>
.wang-editor-box {
    border: 1px solid #ddd;

    .wang-editor-tool {
        border-bottom: 1px solid #ddd;
    }

    &.w-e-full-screen-container {
        z-index: 10;
    }
}
</style>
