<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div class="app-main-wrap">
        <!-- <breadcrumb class="breadcrumb-container" /> -->
        <div style="height: 10px"></div>
        <div class="app-main-ctn">
          <keep-alive :include="cachedViews">
            <!-- <keep-alive> -->
            <router-view :key="key" />
          </keep-alive>
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import Breadcrumb from '@/layout/components/Breadcrumb'
import getPageTitle from '@/utils/get-page-title'
import { mapState } from 'vuex'
const microName = '/chemicallifecycle'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb,
  },
  computed: {
    // 通过global获取user的信息
    ...mapState('global', {
      isInBaseSite: (state) => state.isInBaseSite,
      user: (state) => state.user,
    }),
    cachedViews() {
      //修改基座的标签
      if (this.isInBaseSite) {
        const { tagTitleObj } = this.$store.state.global.user || {}
        this.$store.dispatch('global/setGlobalState', {
          user: {
            ...this.$store.state.global.user,
            tagTitleObj: {
              ...tagTitleObj,
              [this.$route.path]: this.$route.meta.title,
            },
          },
        })
        document.title = getPageTitle(this.$route.meta.title, this.user.title)
        if (this.user.loadedApp['/leadertask']) {
          const { childRoute } = this.user.loadedApp['/leadertask']
          const loadedRoutes = childRoute.map((item) =>
            this.$router.resolve(item)
          )
          console.log('loadedRoutes111', loadedRoutes)
          const loadedRouteNames = loadedRoutes.map((item) => item.route.name)
          console.log('loadedRouteNames111', loadedRouteNames)
          return loadedRouteNames || []
        }

        // return this.user.cachedViews || []
      } else {
        console.log(
          'this.$store.state.tagsView.cachedViews',
          this.$store.state.tagsView.cachedViews
        )
        return this.$store.state.tagsView.cachedViews
      }
    },
    key() {
      return this.$route.fullPath
    },
  },
  created() {
    // console.log(this.$route.meta.isMicrApp)
  },
}
</script>
<style scoped lang="scss">
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 30px);
  width: 100%;
  position: relative;
  overflow: hidden;

  .app-main-wrap {
    padding: 0 10px 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;

    .app-main-ctn {
      flex: 1;
      overflow: auto;
      position: relative;
    }
  }
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 +(20 让底部有一点空间)*/
    min-height: calc(100vh - 104px);
  }
}
</style>
<style lang="scss"></style>
