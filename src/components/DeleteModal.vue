<style lang="scss">
.delete_item {
  color: var(--item-color);
}
</style>
<template lang="html">
  <MasterModal
    modalId="deleteModal"
    modalSize="small"
    btnClasses="delete_item"
    :footerConfirm="deleteItem"
    :footerCancel="deleteCancel"
    :footerBtns="['confirm', 'cancel']"
  >
    <template #trigger>
      <MasterIcon
        :size="triggerIconSize"
        svgName="delete"
        :fillColor="fillColor"
      />
    </template>
    <template #header>
      <h3 class="py-2">{{ modalTitle }}</h3>
    </template>
    <template #default>
      <p class="py-2">{{ deleteDesc }}</p>
    </template>
    <template #footer></template>
  </MasterModal>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import MasterIcon from '@/components/MasterUtils/MasterIcon.vue'
import MasterModal from '@/components/MasterUtils/MasterModal.vue'

const props = defineProps({
  currentItem: {
    default: () => {},
    type: Object
  },
  title: {
    default: 'Delete this item!',
    type: String
  },
  desc: {
    default: 'Hey, Do you really want to delete this item?',
    type: String
  },
  deleteType: {
    default: '',
    type: String
  },
  fillColor: {
    default: '',
    type: String
  },
  triggerIconSize: {
    default: 'medium',
    type: String
  }
})

const store = useStore()
const modalTitle = ref(props.title)
const deleteDesc = ref(props.desc)

const deleteItem = () => {
  if (props.deleteType === 'expenses') {
    store.dispatch(`expenses/deleteById`, props.currentItem?.id)
  } else if (props.deleteType === 'jobs') {
    store.dispatch(`user/deleteById`, props.currentItem?.id)
  } else {
    const dataObj = {
      dataId: props.currentItem?.id,
      dataType: props.deleteType
    }
    store.dispatch(`utils/deleteById`, dataObj)
  }
  return false
}

const deleteCancel = () => true
</script>
