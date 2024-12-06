<template>
  <div class="cd-middle-drop">
    <div class="drop-area">
      <template v-for="(row) in bodyArry" :key="row.row">
          <draggable
            v-model="row.list" 
            :group="{ name:'people',pull: true }"
            item-key="row.row"
            class="cd-row"
            @start="dragStart" 
            @move="dragMove"
            @drop="dragDrop"
          >
            <template #item="{ element }">
              <div :id="element.id" class="cd-col" :class="element.colwidth">
                <div class="cd-label">
                  <div>{{ element.name }}</div>
                </div>
                <div class="cd-field">
                  <div class="cd-item-wrapper">
                    <input disabled class="cd-ipt" type="text" placeholder="请选择">
                  </div>
                </div>
              </div>
            </template>
            
          </draggable>
      </template>
    </div>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { ref,reactive,onMounted,computed } from "vue"
const bodyArry = ref([
  {
    row: 0,
    list: [
      {
        name: '文本',
        type: 'text',
        id: '1',
        colwidth: 'cd-col-12'
      },
      {
        name: '数值',
        id: '2',
        type: 'number',
        colwidth: 'cd-col-12'
      }
    ]
  },
  {
    row: 1,
    list: [
      {
        name: '文本',
        type: 'text',
        id: '8',
        colwidth: 'cd-col-12'
      },
      {
        name: '数值',
        id: '9',
        type: 'number',
        colwidth: 'cd-col-12'
      }
    ]
  },
])
const dragStart = (evt,n) => {
  console.log(evt,n,'dragStart')
}

const dragMove = (evt) => {
  console.log(evt,'evt-')
}

const dragDrop = (evt) => {
  console.log(bodyArry,'drop')
}
</script>

<style lang="less" scoped>
*{
  box-sizing: border-box;
}
@primary-line-color: #cccccc;
@primary-bgd-color: #f2f3f5;
@white-color: #fff;
.item{
  color: #e8797b;
  background-color: red !important;
}
.cd-middle-drop{
  flex: 1;
  height: 100%;
  border: 1px solid @primary-line-color;
  padding: 20px 20px 0;
  .drop-area{
    background-color: @white-color;
    overflow-y: auto;
    height: 100%;
    border-radius: 5px 5px 0 0;
    border: 1px solid @primary-line-color;
    padding: 0 10px;
    padding-bottom: 50px;
    .ghost{
      opacity: .3;
    }
    .chosenClass{
      // background-color: red !important;

    }
    .cd-row{
      display: flex;
      border-bottom: 1px solid gray;
      .isCloned{
        color: #e8797b !important;
        background-color: red !important;
      }
  
      .cd-col{
        min-height: 52px;
        padding: 10px 8px;
        display: flex;
        align-items: center;
        border-left: 1px solid gray;
        .cd-label{
          width: 108px;
          min-width: 108px;
          max-width: 108px;
        }
        .cd-field{
          // width: ;
          flex-grow: 1;
          .cd-item-wrapper{
            border: 1px solid gray;
            border-radius: 5px;
            padding: 5px;
            .cd-ipt{
              border: none;
              outline: none;
              height: 100%;
            }
          }
          
        }
        &.cd-col-24{
          width: 100%;
        }
        &.cd-col-12{
          width: 50%;
        }
        &.cd-col-8{
          width: 33.3%;
        }
        &.cd-col-6{
          width: 25%;
        }
      }

      .item{
        color: #e8797b !important;
        background-color: red !important;
      }

    }
  }
}
</style>
