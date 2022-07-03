<template>
  <div class="nav">
    <ul class="pc-menu">
      <li v-for="(item, i) in $s.menus" :key="i">
        <a v-if="item.link.indexOf('http') === 0" :href="item.link" :target="item.newtab ? '_blank': 'self'">{{item.name}}</a>
        <router-link v-else :to="item.link" :target="item.newtab ? '_blank': 'self'">{{item.name}}</router-link>
      </li>
    </ul>
    
  </div>
</template>

<script>
export default {
  name: 'navbar',
  props: {
    msg: String
  },
  data() {
    return {
      mobileMenu: false,
    }
  }
}
</script>
<style scoped lang="less">
.nav {
  ul {
    list-style: none;
    outline: none;
    li {
      display: inline-block;
      a {
        color: #fff;
        font-size: 28px;
        text-decoration: none;
        padding: 0 36px;
        font-weight: lighter;
        opacity: .9;
        font-weight: bold;
        &.router-link-exact-active, &.router-link-active {
          color: #04C19E;
          opacity: 1;
        }
        // @media screen and (max-width: 1100px) {
        //   font-size: 24px;
        //   padding: 0 30px;
        // }
        @media screen and (max-width: 1280px) {
          font-size: 20px;
          padding: 0 20px;
        }
        @media screen and (max-width: 1110px) {
          font-size: 20px;
          padding: 0 10px;
        }
        @media screen and (max-width: 1080px) {
          font-size: 22px;
          padding: 0 12px;
        }
      }
    }
  }
}
.mobile-menu {
  display: none;
  ul {
    display: none;
  }
  .active {
    display: block;
  }
  .menu-btn {
    position: absolute;
    top:0;
    left: 0;
    line-height: 105px;
    img {
      width: 45px;
      height: 45px;
      vertical-align: middle;
    }
  }
}
@media screen and (max-width: 700px) {
  .nav {
    line-height: 24px;
    width: 340px;
  }
  .pc-menu {
    display: flex;
    width: 240px;
  }
  .mobile-menu {
    display: inline-block;
    ul {
      position: absolute;
      top: 72px;
      left: 0;
      width: calc(12% + 100px);
      text-align: center;
      background: #fff;
      border-radius: 0 0 16px 16px;
      margin-left: -50px;
      margin-right: -50px;
      z-index: 2;
      li {
        display: block;
        border-bottom: 1px solid #eee;
        &:last-of-type {
          border-bottom: none;
        }
        a {
          display: block;
          color: #4D7DE8;
          height: 60px;
          line-height: 60px;
        }
      }
    }
  }
}

</style>
