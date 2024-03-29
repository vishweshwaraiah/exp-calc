<style lang="scss">
#filtersModal {
  display: flex;

  .grid-summary {
    display: inline-flex;
    padding: 0;
  }

  .category-card {
    display: inline-flex;
    box-shadow: boxShadow(bottom);

    .calc-card {
      border-radius: var(--radius-default);
    }
  }
}
</style>
<template lang="html">
  <div class="filters">
    <MasterModal
      modalId="filtersModal"
      modalSize="medium"
      btnClasses="grid-summary"
    >
      <template #trigger>
        <MasterIcon
          size="medium"
          svgName="grid-light"
          fillColor="var(--item-color)"
        />
      </template>
      <template #header>
        <h1>
          <span>Summary</span>
          <span v-if="!allRows && monthly"> for {{ monthly }} </span>
        </h1>
      </template>
      <template #default>
        <TabsGroup @emitStatus="activeStatus">
          <TabsItem title="Expenses" tabId="tab_one" :isActive="isActive">
            <div v-if="ExpensesObjects.length" class="content-holder">
              <span
                v-for="iData in ExpensesObjects"
                :key="iData.optName"
                class="category-card m-1"
              >
                <MasterBadge
                  :item="iData"
                  titleKey="totalAmount"
                  class="calc-card p-2"
                  dataKey="optName"
                  svgName="indian-rupees"
                />
              </span>
            </div>
            <div v-else class="content-holder">
              <h3>No items found!</h3>
            </div>
          </TabsItem>
          <TabsItem title="Incomes" tabId="tab_two" :isActive="isActive">
            <div v-if="IncomesObjects.length" class="content-holder">
              <span
                v-for="iData in IncomesObjects"
                :key="iData.optName"
                class="category-card m-1"
              >
                <MasterBadge
                  :item="iData"
                  titleKey="totalAmount"
                  class="calc-card p-2"
                  dataKey="optName"
                  svgName="indian-rupees"
                />
              </span>
            </div>
            <div v-else class="content-holder">
              <h3>No items found!</h3>
            </div>
          </TabsItem>
          <TabsItem title="Credits" tabId="tab_three" :isActive="isActive">
            <div v-if="CreditsObjects.length" class="content-holder">
              <span
                v-for="iData in CreditsObjects"
                :key="iData.optName"
                class="category-card m-1"
              >
                <MasterBadge
                  :item="iData"
                  titleKey="totalAmount"
                  class="calc-card p-2"
                  dataKey="optName"
                  svgName="indian-rupees"
                />
              </span>
            </div>
            <div v-else class="content-holder">
              <h3>No items found!</h3>
            </div>
          </TabsItem>
        </TabsGroup>
      </template>
    </MasterModal>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { GroupByKey, UnderscoreToSpace } from '@/utils/globals'
import MasterModal from '@/components/MasterUtils/MasterModal.vue'
import MasterIcon from '@/components/MasterUtils/MasterIcon.vue'
import MasterBadge from '@/components/MasterUtils/MasterBadge.vue'
import TabsGroup from '@/components/MasterUtils/TabsGroup.vue'
import TabsItem from '@/components/MasterUtils/TabsItem.vue'

const props = defineProps({
  dataArray: {
    default: () => [],
    type: Array,
    required: true
  },
  monthly: {
    default: '',
    type: String
  },
  allRows: {
    default: true,
    type: Boolean
  }
})

const isActive = ref('')

const dataArray = computed(() => props.dataArray)

const groupedData = GroupByKey(dataArray.value, 'category')

const FilterData = (dataType) =>
  groupedData &&
  Object.keys(groupedData)
    ?.map((key) => {
      const computedData = groupedData[key]?.reduce((res, i) => {
        if (i.type[0]?.optValue === dataType) {
          res = res + Number(i.amount)
        }
        return res
      }, 0)

      const catObj = groupedData[key][0]?.category
      return {
        totalAmount: computedData.toLocaleString('en-IN'),
        optName: UnderscoreToSpace(key),
        colorFill: catObj?.colorFill
      }
    })
    .filter((i) => i.totalAmount !== '0')

const ExpensesObjects = FilterData('expense')

const IncomesObjects = FilterData('income')

const CreditsObjects = FilterData('credits')

const activeStatus = (status) => {
  isActive.value = status
}
</script>
