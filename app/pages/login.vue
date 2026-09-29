<template>
  <div class="flex w-full h-screen justify-center items-center">
    <AppCard :level="1" class="flex flex-row p-0">
      <div class="relative w-1/2 min-w-48 max-h-full rounded-l-card bg-red-500">
        <img src="/images/meeting.jpg" alt="Meeting" class="w-full h-full object-cover rounded-l-card" />
      </div>
      <div v-if="tab == 'login'" class="w-1/2 min-w-48 flex flex-col p-6 space-y-8">
        <h1 class="text-heading font-heading">Welcome to Taskflow</h1>
        <AppInput label="Email" v-model="email" />
        <AppInput label="Password" type="password" v-model="password" />
        <div class="flex flex-col">
          <AppButton variant="primary" @click="onLogin" :loading="buttonLoading == 'login'">Login</AppButton>
          <p class="text-caption font-caption cursor-pointer hover:underline mt-2" @click="() => {email = 'john.smith@gmail.com'; password = '123456'}">DEBUG: fill user login</p>
        </div>
        <div class="flex flex-row space-x-2">
          <p>Don't have an account yet?</p>
          <button class="text-blue-500 hover:underline" @click="tab = 'register'">Sign Up</button>
        </div>
      </div>
      <div v-if="tab == 'register'" class="w-1/2 min-w-48 flex flex-col p-6 space-y-8">
        <h1 class="text-heading font-heading">Create An Account</h1>
        <AppInput label="Name" v-model="name" />
        <AppInput label="Email" v-model="email" />
        <AppInput label="Password" type="password" v-model="password" />
        <AppButton variant="primary" @click="onRegister" :loading="buttonLoading == 'register'">Register</AppButton>
        <div class="flex flex-row space-x-2">
          <p>Already have an account?</p>
          <button class="text-blue-500 hover:underline" @click="tab = 'login'">Sign In</button>
        </div>
      </div>
    </AppCard>
  </div>
</template>
<script setup>
import { login, register, useApi } from '~/composables/useApi';
import { useRouter } from 'vue-router';
import useNotification from '~/composables/useNotification'
const { showSuccess, showError } = useNotification();
const router = useRouter();
definePageMeta({
  layout: 'login'
})

const tab = ref('login')

const name = ref('')
const email = ref('')
const password = ref('')

const buttonLoading = ref(null);

const onLogin = async () => {
  try {
    buttonLoading.value = 'login';
    const authToken = await login(email.value, password.value)
    if (authToken == null) {
      showError('Invalid email or password', 'please try again')
    }
    else {
      showSuccess('Login Succeeded!', 'redirecting...')
      router.push("/")
    }
  }
  catch (e) {
    console.log(e.response);
    showError(Array.isArray(e?.response?.data?.message) && e.response.data.message.length > 0 ? `Error: ${e.response.data.message[0]}` : (`Error: ${e?.response?.data?.message}` ?? e))
  }
  finally {
    buttonLoading.value = null;
  }
}

const onRegister = async () => {
  try {
    buttonLoading.value = 'register';
    const authToken = await register(name.value, email.value, password.value)
    if (authToken == null) {
      showError('Registration failed', 'please try again')
    }
    else {
      showSuccess('Login Succeeded!', 'redirecting...')
      router.push("/")
    }
  }
  catch (e) {
    console.log(e.response);
    showError(Array.isArray(e?.response?.data?.message) && e.response.data.message.length > 0 ? `Error: ${e.response.data.message[0]}` : (`Error: ${e?.response?.data?.message}` ?? e))
  }
  finally {
    buttonLoading.value = null;
  }
}
</script>