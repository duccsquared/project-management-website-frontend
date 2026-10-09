import useNotification from '~/composables/useNotification'

export const useErrorWrapper = (func, loadingRef = null) => {
  const { showSuccess, showError } = useNotification();

  const errorWrapper = async (...args) => {
    try {
      if(loadingRef != null) {
        loadingRef.value = true;
      }
      return await func(...args);
    }
    catch(e) {
      console.error(e)
      showError(`API Error: ${e?.response?.data?.message ?? e}`);
    }
    finally {
      if(loadingRef != null) {
        loadingRef.value = false;
      }
    }
  }

  return errorWrapper
}
