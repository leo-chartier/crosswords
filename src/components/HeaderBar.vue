<template>
  <header>
    <slot></slot>
  </header>
</template>

<style scoped>
header {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}

:deep(button) {
  padding: 0.5em 1em;
  font-size: 1em;
  border-radius: 5px;
}
</style>
