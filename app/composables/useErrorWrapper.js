import useNotification from '~/composables/useNotification'

export const useErrorWrapper = (func, loadingRef) => {
  const { showSuccess, showError } = useNotification();

  const errorWrapper = async (func) => {
    try {
      if(loadingRef != null) {
        loadingRef.value = true;
      }
      return await func();
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

  return (loadingRef=null) => errorWrapper(func, loadingRef);
}
