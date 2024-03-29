<style lang="scss" scoped>
.exp-container {
  display: grid;
  grid-template-areas:
    'balance balance balance income expense'
    'balance balance balance credits credits';
  gap: px2rem(10);

  & > div {
    padding: 0.5rem 0;
    border-radius: var(--radius-default);
  }

  .price-box {
    display: inline-flex;
    box-shadow: boxShadow(menu);
    align-items: center;
    justify-content: flex-start;
    width: 100%;

    &:hover {
      box-shadow: boxShadow(menu);
    }

    h4 {
      margin-left: px2rem(5);
    }

    .details-icon {
      width: 30%;
    }

    &.credits-count {
      grid-area: credits;
      background-color: v-bind('bgColors.credits');

      .details-icon {
        width: 20%;
      }
    }

    &.balance-count {
      grid-area: balance;
      background-color: var(--blue);
      flex-direction: column;
      text-align: center;
      justify-content: space-evenly;
      height: 100%;
    }

    &.income-count {
      grid-area: income;
      background-color: v-bind('bgColors.income');
    }

    &.expense-count {
      grid-area: expense;
      background-color: v-bind('bgColors.expense');
    }

    .details-box {
      width: 70%;

      .details-label {
        margin-left: px2rem(6);
      }
    }
  }

  .money.minus,
  .money.plus,
  .balance-amount,
  .money.equal {
    letter-spacing: px2rem(1);
    white-space: nowrap;
    color: var(--white);
  }
}

.day-months {
  margin-top: 1rem;
  justify-content: space-around;

  .daily-card {
    padding: 1rem;
    background: var(--item-color);
    color: var(--bg-color);
    flex: 1;
    border-radius: var(--radius-default);
    box-shadow: boxShadow(menu);
    white-space: nowrap;
  }

  @include mediaQuery(laptop) {
    .daily-card {
      padding: 0.625rem;
    }
  }
}
</style>
<template lang="html">
  <div v-if="expList" class="exp-container flex-center">
    <div class="balance-count price-box hover-transform">
      <MasterIcon
        svgName="cash-bag"
        size="x-large"
        fillColor="var(--glob-light)"
        extraPath="categories"
        class="details-icon"
      />
      <div class="details-box">
        <h4 class="balance-amount details-label">Balance</h4>
        <MasterIcon
          id="balance"
          class="balance-amount"
          svgName="indian-rupees"
          fillColor="var(--glob-light)"
          :labelAfter="balanceMoney.toLocaleString('en-IN')"
          size="medium"
        />
      </div>
    </div>
    <div class="income-count price-box hover-transform">
      <MasterIcon
        svgName="money-plus"
        size="x-large"
        fillColor="var(--glob-light)"
        extraPath="categories"
        class="details-icon"
      />
      <div class="details-box">
        <h4 class="money plus details-label">Income</h4>
        <MasterIcon
          id="money-plus"
          class="money plus"
          svgName="indian-rupees"
          fillColor="var(--glob-light)"
          :labelAfter="incomeValue.toLocaleString('en-IN')"
          size="medium"
        />
      </div>
    </div>
    <div class="expense-count price-box hover-transform">
      <MasterIcon
        svgName="money-minus"
        size="x-large"
        fillColor="var(--glob-light)"
        extraPath="categories"
        class="details-icon"
      />
      <div class="details-box">
        <h4 class="money minus details-label">Expense</h4>
        <MasterIcon
          id="money-minus"
          class="money minus"
          svgName="indian-rupees"
          fillColor="var(--glob-light)"
          :labelAfter="expenseValue.toLocaleString('en-IN')"
          size="medium"
        />
      </div>
    </div>
    <div class="credits-count price-box hover-transform">
      <MasterIcon
        svgName="money-minus"
        size="x-large"
        fillColor="var(--glob-light)"
        extraPath="categories"
        class="details-icon"
      />
      <div class="details-box">
        <h4 class="money minus details-label">Credits</h4>
        <MasterIcon
          id="money-minus"
          class="money minus"
          svgName="indian-rupees"
          fillColor="var(--glob-light)"
          :labelAfter="creditsValue.toLocaleString('en-IN')"
          size="medium"
        />
      </div>
    </div>
  </div>
  <div v-if="totalData" class="day-months flex-center">
    <div class="daily-card">
      <label class="flex-center">Today's Expense:</label>
      <MasterIcon
        class="flex-center"
        svgName="indian-rupees"
        fillColor="var(--bg-color)"
        :labelAfter="todaysExpense.toLocaleString('en-IN')"
        size="small"
      />
    </div>
    <div class="daily-card">
      <label class="flex-center">Today's Income:</label>
      <MasterIcon
        class="flex-center"
        svgName="indian-rupees"
        fillColor="var(--bg-color)"
        :labelAfter="todaysIncome.toLocaleString('en-IN')"
        size="small"
      />
    </div>
    <div class="daily-card">
      <label class="flex-center">This Month's Expense:</label>
      <MasterIcon
        class="flex-center"
        svgName="indian-rupees"
        fillColor="var(--bg-color)"
        :labelAfter="monthsExpense.toLocaleString('en-IN')"
        size="small"
      />
    </div>
    <div class="daily-card">
      <label class="flex-center">This Month's Income:</label>
      <MasterIcon
        class="flex-center"
        svgName="indian-rupees"
        fillColor="var(--bg-color)"
        :labelAfter="monthsIncome.toLocaleString('en-IN')"
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FilterByDay, FilterByMonth } from '@/utils/globals'
import MasterIcon from '@/components/MasterUtils/MasterIcon.vue'

const props = defineProps({
  dataList: {
    type: Array,
    default: () => [],
    required: true
  },
  totalData: {
    type: Array,
    default: () => [],
    required: true
  }
})

const expList = computed(() => props.dataList)

const todaysData = computed(() => FilterByDay(props.dataList))
const monthsData = computed(() => FilterByMonth(props.dataList))

const getDataByType = (dataArray, type) => {
  const filteredData = dataArray?.filter((i) => {
    return i.type[0]?.optValue === type
  })

  const dataValue = filteredData?.reduce((acc, item) => {
    return Number(acc) + Number(item.amount)
  }, 0)

  return dataValue
}

const todaysExpense = computed(() => getDataByType(todaysData.value, 'expense'))
const todaysIncome = computed(() => getDataByType(todaysData.value, 'income'))

const monthsExpense = computed(() => getDataByType(monthsData.value, 'expense'))
const monthsIncome = computed(() => getDataByType(monthsData.value, 'income'))

const expenseValue = computed(() => getDataByType(expList.value, 'expense'))
const incomeValue = computed(() => getDataByType(expList.value, 'income'))
const creditsValue = computed(() => getDataByType(expList.value, 'credits'))

const balanceMoney = computed(() => incomeValue.value - expenseValue.value)

const bgColors = {
  expense: 'var(--expense-color)',
  income: 'var(--income-color)',
  credits: 'var(--credits-color)'
}
</script>
