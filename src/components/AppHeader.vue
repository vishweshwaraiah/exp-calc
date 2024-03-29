<style lang="scss">
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 0;
  height: 4rem;
  z-index: 9;
  padding: 0;
  -webkit-app-region: drag;

  .controls-bar {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: px2rem(5);

    .top-btn {
      -webkit-app-region: no-drag;
      background: transparent;
      border: px2rem(2) solid transparent;
      width: px2rem(50);
      height: px2rem(40);
      outline: 0;
      padding: px2rem(1);
      margin: px2rem(1);

      > * {
        width: 100%;
        height: 100%;
        border-radius: var(--radius-default);

        &:hover {
          background: var(--item-color);
          border: px2rem(2) solid var(--item-color);
        }

        &:focus {
          outline: 0;
        }
      }
    }

    .theme-switcher {
      -webkit-app-region: no-drag;
      width: px2rem(50);
      height: px2rem(40);
    }
  }

  .logo-menus {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    height: px2rem(50);

    .master-logo {
      box-shadow: boxShadow(menu);
      border-radius: var(--radius-default);
      background-color: var(--menu-color);
      -webkit-app-region: no-drag;
      justify-content: center;
      align-items: center;
      padding: 0 1rem;
      display: flex;
    }
  }
}
</style>
<template lang="html">
  <header class="main-header">
    <div class="controls-bar">
      <MasterSwitch
        labelPos="left"
        input-width="2rem"
        @click="reloadPage"
        trueIcon="reload"
        falseIcon="reload"
        class="theme-switcher"
      />
      <MasterSwitch
        labelPos="left"
        input-width="3rem"
        v-model:inputValue="SwitchOn"
        @click="switchClick"
        trueIcon="sun-moon"
        falseIcon="sun-moon"
        class="theme-switcher"
      />
      <button @click="minApp" class="top-btn app-minimize" title="Minimize">
        <MasterIcon
          size="x-small"
          svgName="minimize"
          fillColor="var(--item-color)"
          hoverInverse
        />
      </button>
      <button @click="maxApp" :class="`top-btn ${maxClass}`" :title="maxTitle">
        <MasterIcon
          v-if="isMaximized"
          size="x-small"
          svgName="restore"
          fillColor="var(--item-color)"
          hoverInverse
        />
        <MasterIcon
          v-else
          size="x-small"
          svgName="maximize"
          fillColor="var(--item-color)"
          hoverInverse
        />
      </button>
      <button @click="closeApp" class="top-btn app-close" title="Close">
        <MasterIcon
          size="x-small"
          svgName="close-filled"
          fillColor="var(--item-color)"
          hoverInverse
        />
      </button>
    </div>
    <div class="container-fluid logo-menus">
      <router-link to="/" class="master-logo">
        <MasterIcon
          size="large"
          svgName="master-logo"
          fillColor="var(--item-color)"
        />
      </router-link>
      <slot></slot>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MasterIcon from '@/components/MasterUtils/MasterIcon.vue'
import MasterSwitch from '@/components/MasterInputs/MasterSwitch.vue'

const ipc = window.ipcRenderer
const date = new Date()

const isMaximized = ref(true)
const maxClass = ref('app-maximize')
const maxTitle = ref('Maximize')
const SwitchOn = ref()
const darkTheme = computed(() => {
  const isDay = date.getHours() >= 6 && date.getHours() <= 18
  if (!isDay) {
    return true
  } else {
    return false
  }
})

if (darkTheme.value) {
  SwitchOn.value = true
} else {
  SwitchOn.value = false
}

const reloadPage = () => {
  window.location.reload()
}

const toggleTheme = (type = 'isLight') => {
  if (type === 'isDark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

const switchClick = () => {
  if (SwitchOn.value) {
    toggleTheme('isDark')
  } else {
    toggleTheme('isLight')
  }
}

onMounted(() => {
  if (darkTheme.value) {
    toggleTheme('isDark')
  }
})

const closeApp = () => {
  ipc.send('CloseApp')
}

const minApp = () => {
  ipc.send('MinimizeApp')
}

const maxApp = () => {
  ipc.send('MaximizeApp')
}

const changeMaxBtn = (isMax) => {
  if (isMax) {
    isMaximized.value = true
    maxClass.value = 'app-maximize'
    maxTitle.value = 'Maximize'
  } else {
    isMaximized.value = false
    maxClass.value = 'app-restore'
    maxTitle.value = 'Restore'
  }
}

ipc.on('isMaximized', () => changeMaxBtn(true))
ipc.on('isRestored', () => changeMaxBtn(false))
</script>
