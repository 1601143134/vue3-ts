<template>
  <table class="base-form">
    <colgroup>
      <col style="width: 100px;">
      <col style="width: 200px;">
      <col style="width: 180px;">
      <col style="width: 80px;">
      <col style="width: 120px;">
      <col style="width: 180px;">
    </colgroup>
    <thead>
      <th />
      <th>名称</th>
      <th>类型</th>
      <th>必填</th>
      <th>长度</th>
      <th>默认值</th>
      <th>描述</th>
    </thead>
    <tbody>
      <tr v-for="(item, index) in innerList" :key="item.id">
        <td>
          <el-tooltip class="item" effect="dark" content="$t('addPrams')" placement="top">
            <div style="margin-right: 10px;" class="el-icon-circle-plus-outline icon" @click="handleAddReqHRow(index)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="$t('delPrams')" placement="top">
            <div class="el-icon-delete icon" @click="handleDelRow(index)" />
          </el-tooltip>
        </td>
        <td>
          <el-input v-model="item.name" placeholder="$t('holderName')" />
        </td>
        <td>
          <el-select v-model="item.reqType" placeholder="$t('holderSelect')">
            <el-option
              v-for="item in dataType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </td>
        <td>
          <el-checkbox v-model="item.require" />
        </td>
        <td>
          <el-input v-model="item.length" placeholder="$t('length')" />
        </td>
        <td>
          <el-input v-model="item.default" placeholder="$t('default')" />
        </td>
        <td>
          <el-input
            v-model="item.textarea"
          
            type="textarea"
            placeholder="$t('holderDesc')"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// import table from '../../preview/ApiPreview/table.vue'
// import DataType from '../js/type'
export default {
  name: 'BaseForm',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: -1
    },
    historyModel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerList: [
        {
          id: (+new Date()),
          name: '',
          reqType: 'string',
          require: true,
          default: '',
          textarea: '',
          length: ''
        }
      ],
      dataType: [
        {
          label:'stirng',
          value: 1
        }
      ]
    }
  },
  watch: {
    innerList: {
      handler(n) {
        
        // 更新父组件数据
        this.$emit('update', n, this.index)
      },
      deep: true
    },
    list(n) {
      this.innerList = JSON.parse(JSON.stringify(this.list))
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.list,'list')
    //   if (this.list.length) {
    //     this.innerList = JSON.parse(JSON.stringify(this.list))
    //   }
    // })
    
  },
  methods: {
    // 添加行
    handleAddReqHRow(index) {
      const params = {
        id: (+new Date()),
        name: '',
        reqType: 'string',
        require: true,
        default: '',
        textarea: ''
      }
      if (index == this.innerList.length - 1) {
        // 是否在最后添加
        this.innerList.push(params)
      } else {
        // 指定位置添加
        this.innerList.splice(index + 1, 0, params)
      }
    },
    // 删除行
    handleDelRow(index) {
      if (this.innerList.length == 1) return this.$message.warning('至少保留一个参数')
      this.innerList.splice(index, 1)
    }
  }

}

</script>
<style lang="less" scoped>
.icon{
    font-size: 17px;
    cursor: pointer;
}
::v-deep .el-table__header-wrapper table{
    margin-bottom: 0 !important;
    thead {
        tr{
            border: none !important;
        }
        th{
            border-left: none !important;
            border-top: none !important;
        }
    }
}
::v-deep .el-table__body-wrapper table{
    margin-bottom: 0 !important;
    tbody {
        tr{
            border: none !important;
        }
        td{
            border-left: none !important;
            border-top: none !important;
        }
    }
}

.base-form{
    display: inline-table;
    min-width: 800px;
    width: 100%;
    thead{
        background-color: #f5f7f9;
        th{
            text-align: center;
        }
    }
    tbody{
        text-align: center;
        vertical-align: middle;
    }
}
</style>