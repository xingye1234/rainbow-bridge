<script setup lang='ts'>
import Quill from 'quill'

const props = withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  {
    placeholder: '',
  },
)

const textValue = defineModel<string>('text', { default: '' })

const editor = useTemplateRef('editor')
const quillRef = shallowRef<Quill>()

function onTextChange() {
  textValue.value = quillRef.value?.getText() ?? ''
}

watchEffect(() => {
  if (!editor.value)
    return
  quillRef.value = new Quill(editor.value, {
    placeholder: props.placeholder,
  })
  quillRef.value.on('text-change', onTextChange)
})
</script>

<template>
  <div ref="editor" class="app-editor h-full overflow-auto text-base!" />
</template>
