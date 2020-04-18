<template>
  <div>
    <el-button type="info" @click="fnquit()">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    fnquit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="less" scoped>
</style>