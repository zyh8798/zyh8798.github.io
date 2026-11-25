<script setup lang="ts">
defineProps<{ current: 'zyh' | 'shh' }>()

const authors = [
  { id: 'zyh', name: '英豪', path: '/reactNote_zyh/', icon: 'i-ri-book-open-line' },
  { id: 'shh', name: '海浩', path: '/reactNote_shh/', icon: 'i-ri-quill-pen-line' },
] as const
</script>

<template>
  <div class="react-notes-nav">
    <nav class="react-notes-authors" aria-label="笔记作者">
      <RouterLink
        v-for="author in authors"
        :key="author.id"
        :to="author.path"
        :class="author.id"
        :aria-current="current === author.id ? 'page' : undefined"
      >
        <span :class="author.icon" aria-hidden="true" />
        {{ author.name }}
      </RouterLink>
    </nav>
    <a
      class="react-notes-course"
      href="https://www.bilibili.com/video/BV1mcpPeMETt/"
      target="_blank"
      rel="noopener noreferrer"
    >
      B 站课程
      <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
    </a>
  </div>
</template>

<style scoped>
.react-notes-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding-block-end: 0.875rem;
  margin-block: 0.25rem 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
}

.react-notes-authors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.react-notes-nav a {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.75rem;
  padding-inline: 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 150ms ease;
}

.react-notes-authors a {
  color: var(--note-accent);
}

.react-notes-nav .zyh {
  --note-accent: #1d4ed8;
}

.react-notes-nav .shh {
  --note-accent: #6d28d9;
}

:global(.dark) .zyh {
  --note-accent: #93c5fd;
}

:global(.dark) .shh {
  --note-accent: #c4b5fd;
}

.react-notes-nav a:hover,
.react-notes-nav a[aria-current='page'] {
  background-color: color-mix(in srgb, currentColor 12%, transparent);
}

.react-notes-nav a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.react-notes-course {
  color: inherit;
  font-size: 0.875rem;
}
</style>
