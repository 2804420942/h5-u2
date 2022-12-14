import {ref, onMounted, onUnmounted} from 'vue'

export function useClickOutside(elementRef,isOpen) {
    const isClickOutside = ref(false)
    function handler(e) {
        if (elementRef.value) {
            if (!elementRef.value.contains(e.target)) {
                isClickOutside.value = true
                if (isOpen) {
                    if (isOpen.value) isOpen.value = false
                }
            } else {
                isClickOutside.value = false
            }
        }
    }
    onMounted(() => {
        document.addEventListener('click', handler)
    })
    onUnmounted(() => {
        document.removeEventListener('click', handler)
    })
    return isClickOutside
}



