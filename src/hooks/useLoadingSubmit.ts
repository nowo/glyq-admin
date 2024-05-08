import type { Ref } from 'vue'
import { ref } from 'vue'

type AutoLoadingResult = [
    <T>(requestPromise: Promise<T>) => Promise<T>,
    Ref<boolean>,
]

/* 在给run方法传入一个promise，会在promise执行前或执行后将loading状态设为true，在执行完成后设为false */
export function useLoadingSubmit(defaultLoading = false): AutoLoadingResult {
    const loading = ref(defaultLoading)

    async function run<T>(requestPromise: Promise<T>): Promise<T> {
        loading.value = true
        try {
            return await requestPromise
        } finally {
            loading.value = false
        }
    }

    return [run, loading]
}
