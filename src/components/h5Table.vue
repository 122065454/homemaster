  <template>
  <section class="h5TableTitle between numbers" :class="chainName" @click="onitem" v-show="isShow">
    <!--up down  sort-->
    <div class="item">
      <div v-if="kind=='Reward'" class="dig-item">
        <img :src="getDigPic(item.pool_type)" alt="" />
        <div>
          <p class="numbers SemiBold">{{ name }}</p>
          <p>
            <CountUp :endVal="_transferNum(transaction, getLanguage)" />
            {{ Number(transaction) >= (['zh-CN', 'zh-HK'].includes(getLanguage) ? 10000000 : 100000000) ? $t('unitB') : Number(transaction) >= 10000 ? $t('unitM') : '' }}/
            {{ per }}{{ _transferNum(reward, getLanguage) }}{{ Number(reward) >= (['zh-CN', 'zh-HK'].includes(getLanguage) ? 10000000 : 100000000) ? $t('unitB') : Number(reward) >= 10000 ? $t('unitM') : '' }}{{ after }}
          </p>
        </div>
      </div>
      <template v-else>
        <p class="numbers SemiBold">{{ name }}</p>
        <p><CountUp :endVal="Number(transaction)" /></p>
      </template>
    </div>
    <div class="item right" v-if="isDoubleBenefit()">
      <div>
        {{ getformatFloat(this.PersonalIncome['earn']) }}
        <span class="span" v-if="$route.path.includes('boardroom')">{{item.earned_token}}</span>
        <span class="span" v-else>MDX</span>
      </div>
      <div>
        {{ getformatFloat(this.PersonalIncome['mdx']) }}
        <span class="span" v-if="$route.path.includes('boardroom')">{{item.pool_name}}</span>
        <span class="span" v-else>MDX</span>
      </div>
    </div>
    <div class="item right" v-else>
      <p>
        {{ getformatFloat(this.PersonalIncome) }}
        <span class="span" v-if="$route.path.includes('boardroom')">{{item.earnedToken}}</span>
        <span class="span" v-else>MDX</span>
      </p>
      <p v-if="kind!='Reward'">{{ per }}<CountUp :endVal="Number(reward)" /> {{ after }}</p>
    </div>
    <div class="item-end" @click.stop="topicShowHandle">
      <CountUp :endVal="needApy ? Number(APY > 0 ? getApy() : 0) : (APY > 0 ? APY:0)" />%
      <div class="topic_content" v-show="topicShow"><ApyTopic :apy="APY" :item="item" :kind="kind=='Reward' ? (item.pool_type == 3 ? 'lockup' : kind) : kind"/></div>
      <div class="topic" v-if="APY > 0"><img :src="chainName=='Heco' ? hecoTopic : bscTopic" alt=""/></div>
    </div>
  </section>
</template>
<script>
import { formatFloat } from "@/utils/formatBalance"
import ApyTopic from "@/views/Boardroom/ApyTopic/ApyTopic"
import LockupTopic from "@/views/Boardroom/Lockup/LockupTopic/LockupTopic"
import { _transferNum } from "@/utils/comMethod"
export default {
  name: "h5Table",
  data() {
    return {
      topicShow: false,
      hoverIndex: -1, // 鼠标悬停
      bscTopic: require('@/assets/bsc_topic.png'),
      hecoTopic: require('@/assets/h5_heco_topic.png'),
      listAct: 0,
      listItemAct: 0,
      searchValue: "",
      listItem: [],
      per: "",
      after: "",
      earned: "",
    };
  },
  props: {
    kind: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      default: -1,
    },
    item: {
      type: Object,
      default: () => {},
    },
    needApy: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: "",
    },
    transaction: {
      type: String | Number,
      default: "",
    },
    PersonalIncome: {
      type: String | Number,
      default: "",
    },
    reward: {
      type: String | Number,
      default: "",
    },
    APY: {
      type: String | Number,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  components: { ApyTopic, LockupTopic },
  beforeMount() {},
  mounted() {
    this.unit();
  },
  computed: {
    chainName() {
      return this.$store.state.chainName;
    },
    isShow() {
      if (this.show) {
        if (this.isDoubleBenefit()) {
          return this.item.__reward['earn'] == 0 || this.item.__reward['mdx'] == 0 ? false : true
        } else {
          return this.PersonalIncome === 0 ? false : true;
        }
      }
      return true;
    }
  },
  methods: {
    // 挖矿类型
    getDigPic(type) {
      const list = { 
        1: require('@/assets/boardRoom/h5_single_dig.png'), 
        2: require('@/assets/boardRoom/h5_double_dig.png'), 
        3: require('@/assets/boardRoom/h5_lock.png') 
      }
      return list[type]
    },
    // 计算apy
    getApy() {
      if(this.item.pool_type == 3) {
        const weights = this.item['weights']
        let size = Object.keys(weights).length
        return Math.pow(1 + this.APY*weights[size - 1]/365/100, 365)*100 - 100
      } else {
        return Math.pow(1 + this.APY/365/100, 365)*100 - 100
      }
    },
    isDoubleBenefit () {
      return this.kind=='Reward' && this.item.earnedToken.includes('&')
    },
    getformatFloat(val) {
      return formatFloat(val, 2)
    },
    onitem() {
      this.$emit("ontable");
    },
    unit() {
      if (this.$route.path.includes("boardroom")) {
        this.per = "";
        this.after = "";
        this.earned = this.item.earnedToken;
      } else {
        this.per = "";
        this.after = "MDX";
        this.earned = "MDX";
      }
    },
    topicShowHandle() {
      this.$el.parentNode.querySelectorAll('.topic_content').forEach((item, ind) => {
        if(this.index != ind) {
          item.style.display='none'
        } else {
          if (item.style.display=='none') {
            item.style.display = ''
            this.topicShow = true
          } else {
            item.style.display = ''
            this.topicShow = false
          }
        }
      })
    },
    _transferNum
  },
};
</script>

<style scoped lang="less">
.Heco {
  .item-end {
    color: #ffffff;
    background: #03ad90;
  }
  .item p:first-child {
    color: #48587b !important;
  }
  .item div {
    color: #48587b;
  }
}
.Bsc {
  .item-end {
    color: #ffca13;
    background: #2e2e2e;
  }
  .item p:first-child {
    color: #2e2e2e !important;
  }
  .item div {
    color: #2e2e2e;
  }
}

.dig-item {
  display: flex;
  align-items: center;
  img {
    width: 21px;
    height: 21px;
    margin-right: 5px;
  }
  p {
    text-align: left;
    white-space:nowrap;
  }
}

.h5TableTitle {
  height: 66px;
  padding: 0 10px;
  font-size: 12px;
  color: #7f8faf;
  border-bottom: 1px solid #f6f6f6;
}
.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item {
  width: 100%;
  flex-grow: 1;
  & div {
    font-size: 14px;
    text-align: right;
  }
}

.item p:first-child {
  height: 20px !important;
  font-size: 14px !important;
  // color: #48587b;
}
.item p:last-child {
  height: 15px;
  font-size: 12px;
  color: #7f8faf;
}
.right {
  margin-right: 10px;
  p {
    text-align: right;
  }
}

.item-end {
  display: flex;
  position: relative;
  justify-content: flex-end;
  text-align: center;
  align-items: center;
  flex-shrink: 0;
  width: 95px;
  height: 32px;
  font-size: 14px;
  border-radius: 4px;
  padding: 0 6px 0 10px;
  .topic_content {
    position: absolute;
    bottom: 30px;
    left: -125px;
  }
  .topic {
    display: flex;
    align-items: center;
    img {
      width: 14px;
      height: 14px;
      margin-left: 5px;
    }
  }
}
.span {
  margin-left: 2px;
}
/* .item-data {
  }
  .item-button {
    width: 90px;
    background-color: red;
  } */
</style>
