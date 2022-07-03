<template>
  <div class="main text">
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template slot="title">
          <span class="nums numbers">1</span> {{ $t("oneTipsTitle") }}
        </template>
        <div class="tips">
          {{ $t("onesm") }}
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <span class="nums numbers">2</span> {{ $t("oneTipsTitle2") }}
        </template>
        <div class="tips">
          {{ $t("twosm") }}
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <span class="nums numbers">3</span> {{ $t("oneTipsTitle3") }}
        </template>
        <div class="tips">{{ $t("threesm") }}</div>
      </el-collapse-item>
    </el-collapse>
    <div class="right">
      <img src="@/views/buyBack/img/FAQ.png" alt="" />
    </div>
  </div>
</template>
<script>
</script>

<style lang="less" scoped>
.Bsc {
  .nums {
    color: #e5a800;
    background: #fff4bf;
  }
}
.main {
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  height: 268px;
  display: flex;
  align-items: center;
  padding: 30px 22px;
}
.el-collapse {
  width: 755px;
  border: none;
}

/deep/ .el-collapse-item:hover {
  .el-collapse-item__header {
    color: #009a7f;
  }
}

.right {
  img {
    width: 260px;
    height: 194px;
    margin-left: 85px;
  }
}
.nums {
  width: 24px;
  height: 24px;
  background: rgba(3, 173, 144, 0.2);
  font-size: 14px;
  color: #009a7f;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  margin-right: 20px;
}
.tips {
  font-size: 12px;
  color: rgba(60, 60, 67, 0.6);
}
</style>