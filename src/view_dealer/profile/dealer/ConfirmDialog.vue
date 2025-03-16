<template>
  <div v-if="show" class="confirm-dialog-overlay">
    <div class="confirm-dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="confirm-buttons">
        <button @click="$emit('cancel')" class="cancel-button">{{ cancelText }}</button>
        <button @click="$emit('confirm')" class="confirm-button">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '确认'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  
  emits: ['confirm', 'cancel']
};
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.confirm-dialog {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.confirm-dialog h3 {
  margin-top: 0;
  color: #e74c3c;
}

.confirm-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #c0392b;
}
</style> 