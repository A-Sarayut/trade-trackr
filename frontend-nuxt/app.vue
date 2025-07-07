<template>
  <UApp :toaster="{ position: 'top-right', duration: 3000, expand: false }">
    <Navbar />
    <UContainer class="py-8">
      <PageName />
      <NuxtPage />
    </UContainer>
  </UApp>
</template>
