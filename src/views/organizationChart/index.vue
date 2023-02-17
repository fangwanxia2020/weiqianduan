<template>
  <div class="container">
    <ul>
      <li class="flex title">
        <div>组织架构</div>
        <div class="plus" @click="handleAddOrganization">
          <i class="el-icon-plus"></i>
        </div>
      </li>
      <li class="import">
        <el-input placeholder="请输入内容" v-model="organizationName" size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </li>
      <li>
        <el-table
          :data="organizationFilter"
          row-key="id"
          :expand-row-keys="expandOrgTableRow"
          :tree-props="{ children:'children' }"
          style="width:100%"
          default-expand-all
          @cell-click="handleClickOrganization"
        >
          <el-table-column prop="name" label="组织名称"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="handleViewTheOrganization(scope.row)">查看</el-button>
              <el-button type="text" @click.stop="handleDelTheOrganization(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
    <ul v-if="isShowDep" class="middle">
      <li class="flex title">
        <div>部门信息</div>
        <div class="plus" @click="handleAddDepart">
          <i class="el-icon-plus"></i>
        </div>
      </li>
      <li class="import">
        <el-input placeholder="请输入内容" v-model="departmentName" size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </li>
      <li>
        <el-table
          :data="departmentFilter"
          row-key="id"
          :tree-props="{ children:'children' }"
          style="width:100%"
          default-expand-all
          @cell-click="handleClickDepartment"
        >
          <el-table-column prop="name" label="部门名称"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="handleViewTheDepartment(scope.row)">查看</el-button>
              <el-button type="text" @click.stop="handleDelTheDepartment(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
    <ul v-if="isShowPeople">
      <li class="flex title">
        <div>岗位信息</div>
        <div class="plus" @click="handleAddPeople">
          <i class="el-icon-plus"></i>
        </div>
      </li>
      <li class="import">
        <el-input placeholder="请输入内容" v-model="postName" size="small">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </li>
      <li>
        <el-table
          :data="postFilter"
          row-key="id"
          :tree-props="{ children:'children' }"
          style="width:100%"
          default-expand-all
        >
          <el-table-column prop="name" label="岗位名称"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="handleViewThePost(scope.row)">查看</el-button>
              <el-button type="text" @click.stop="handleDelThePost(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
    <el-drawer
      :title="organDrawerTitle"
      :visible.sync="organizationDrawer"
      direction="rtl"
      size="40%"
      ref="organDrawer"
      :before-close="handleCloseOrganization"
    >
      <div class="drawer" style="padding-right:10px">
        <el-form
          class="el-form"
          ref="organForm"
          :model="organForm"
          :rules="organRules"
          label-width="140px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属组织" prop="ancestorNames">
                <el-input
                  v-if="isEditOrganForm"
                  size="mini"
                  :disabled="isEditOrganForm"
                  v-model="organForm.ancestorNames"
                ></el-input>
                <el-select
                  v-if="!isEditOrganForm"
                  v-model="organForm.ancestorIds"
                  ref="organSelect"
                  size="mini"
                  placeholder="请选择所属组织"
                >
                  <el-option :value="groupId" :label="groupLabel" style="height:auto;padding:0;">
                      <el-tree
                          :data="organisation"
                          :props="organProps"
                          accordion
                          @node-click="handleClickOrgNode">
                      </el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法定代表人" prop="representative">
                <el-input
                  size="mini"
                  :disabled="isEditOrganForm"
                  v-model="organForm.representative"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
                <el-form-item label="组织名称" prop="name">
                <el-input
                  size="mini"
                  :disabled="isEditOrganForm"
                  v-model="organForm.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="组织代码" prop="code">
                <el-input
                  size="mini"
                  :disabled="isEditOrganForm"
                  v-model="organForm.code"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="成立日期" prop="establishDate">
                <el-date-picker
                  :disabled="isEditOrganForm"
                  style="width:100%"
                  size="mini"
                  v-model="organForm.establishDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码" prop="representative">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.creditCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="纳税人识别号" prop="taxerCode">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.taxerCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工商注册号" prop="registrationNo">
                <el-input
                  size="mini"
                  :disabled="isEditOrganForm"
                  v-model="organForm.registrationNo"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组织机构代码" prop="organCode">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.organCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contacts">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.contacts"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业类型" prop="representative">
                <el-input v-if="isEditOrganForm" size="mini" :disabled="isEditOrganForm" v-model="organForm.orgTypeName"></el-input>
                <el-select v-if="!isEditOrganForm" size="mini" v-model="organForm.orgTypeName" placeholder="请选择企业类型">
                    <el-option
                        v-for="item in typeOfEnterprise"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="行业" prop="createTime">
                <el-input v-if="isEditOrganForm" size="mini" :disabled="isEditOrganForm" v-model="organForm.industry"></el-input>
                <el-select v-if="!isEditOrganForm" size="mini" v-model="organForm.industry" placeholder="">
                    <el-option
                        v-for="item in industryTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人员规模" prop="representative">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.staffScale"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮政编码" prop="zipcode">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.zipcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在城市" prop="localName">
                <el-input size="mini" :disabled="isEditOrganForm" v-model="organForm.localName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isAddOrganization">
            <el-col :span="24">
              <el-form-item label="详细地址">
                <el-input
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  :autosize="{ minRows: 4, maxRows: 6}"
                  v-model="organForm.address"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isAddOrganization">
            <el-col :span="24">
              <el-form-item label="注册地址">
                <el-input
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  :autosize="{ minRows: 4, maxRows: 6}"
                  v-model="organForm.registerAddress"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isAddOrganization">
            <el-col :span="24">
              <el-form-item label="经营范围">
                <el-input
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  :autosize="{ minRows: 4, maxRows: 6}"
                  v-model="organForm.businessScope"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn">
          <el-button plain size="mini" @click="organizationDrawer = false">取消</el-button>
          <el-button
            v-if="isEditOrganForm"
            type="primary"
            size="mini"
            @click="handleEditOrganization"
          >编辑</el-button>
          <el-button
            v-if="!isEditOrganForm"
            type="primary"
            size="mini"
            @click="handleSaveOrganization"
          >保存</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :title="departDrawerTitle"
      :visible.sync="departDrawer"
      direction="rtl"
      :before-close="handleCloseDepart"
    >
      <div class="drawer" style="padding:0 10%;">
        <el-form ref="departForm" :model="departForm" :rules="departRules" label-width="80px">
          <el-form-item label="所属组织" prop="orgName">
            <el-input v-if="isEditDepartForm" size="mini" :disabled="isEditDepartForm" v-model="departForm.orgName"></el-input>
            <el-select
              v-if="!isEditDepartForm"
              v-model="departForm.orgId"
              ref="departSelectOrga"
              size="mini"
              style="width:100%;"
              placeholder="请选择所属组织"
            >
              <el-option :value="groupId" :label="groupLabel" style="height:auto;padding:0;">
                  <el-tree
                      :data="organisation"
                      :props="organProps"
                      accordion
                      @node-click="handleClickDepartSelectOrgaNode">
                  </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-if="isEditDepartForm" size="mini" :disabled="isEditDepartForm" v-model="departForm.parentName"></el-input>
            <el-select
              v-if="!isEditDepartForm"
              v-model="departForm.parentId"
              ref="departSelect"
              size="mini"
              style="width:100%;"
              placeholder="请选择所属部门"
            >
              <el-option :value="departId" :label="departLabel" style="height:auto;padding:0;">
                  <el-tree
                      :data="department"
                      :props="organProps"
                      accordion
                      @node-click="handleClickDepartNode">
                  </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门编号" prop="id">
            <el-input size="mini" :disabled="isEditDepartForm" v-model="departForm.id"></el-input>
          </el-form-item>
          <el-form-item label="代码" prop="code">
            <el-input size="mini" :disabled="isEditDepartForm" v-model="departForm.code"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input size="mini" :disabled="isEditDepartForm" v-model="departForm.name"></el-input>
          </el-form-item>
          <el-form-item label="部门类型" prop="deptTypeName">
            <el-input v-if="isEditDepartForm" size="mini" :disabled="isEditDepartForm" v-model="departForm.deptTypeName"></el-input>
            <el-select
              v-if="!isEditDepartForm"
              v-model="departForm.deptTypeId"
              ref="departSelectType"
              size="mini"
              style="width:100%;"
              placeholder="请选择部门类型"
            >
              <el-option :value="deptTypeId" :label="deptTypeName" style="height:auto;padding:0;">
                  <el-tree
                      :data="departType"
                      :props="organProps"
                      accordion
                      @node-click="handleClickDepartTypeNode">
                  </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="顺序" prop="orderNum">
            <el-input size="mini" :disabled="isEditDepartForm" v-model="departForm.orderNum"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="leader">
            <el-input size="mini" :disabled="isEditDepartForm" v-model="departForm.leader"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input size="mini" :disabled="isEditDepartForm" v-model="departForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button plain size="mini" @click="departDrawer = false">取消</el-button>
          <el-button v-if="isEditDepartForm" type="primary" size="mini" @click="handleEditDepart">编辑</el-button>
          <el-button
            v-if="!isEditDepartForm"
            type="primary"
            size="mini"
            @click="handleSaveDepart"
          >保存</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :title="peopleDrawerTitle"
      :visible.sync="peopleDrawer"
      direction="rtl"
      :before-close="handleClosePeople"
    >
      <div class="drawer" style="padding:0 10%;">
        <el-form ref="peopleForm" :model="peopleForm" :rules="peopleRules" label-width="80px">
          <el-form-item label="所属组织" prop="orgName">
            <el-input v-if="isEditPeopleForm" size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.orgName"></el-input>
            <el-select
              v-if="!isEditPeopleForm"
              v-model="peopleForm.orgId"
              ref="peopleSelectOrga"
              size="mini"
              style="width:100%;"
              placeholder="请选择所属组织"
            >
              <el-option :value="peopleGroupId" :label="peopleGroupLabel" style="height:auto;padding:0;">
                  <el-tree
                      :data="organisation"
                      :props="organProps"
                      accordion
                      @node-click="handleClickPeopleSelectOrgaNode">
                  </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-if="isEditPeopleForm" size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.deptName"></el-input>
            <el-select
              v-if="!isEditPeopleForm"
              v-model="peopleForm.deptId"
              ref="peopleSelectDepart"
              size="mini"
              style="width:100%;"
              placeholder="请选择所属部门"
            >
              <el-option :value="peopleDepartId" :label="peopleDepartLabel" style="height:auto;padding:0;">
                  <el-tree
                      :data="department"
                      :props="organProps"
                      accordion
                      @node-click="handleClickPeopleSelectDepartNode">
                  </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代码" prop="code">
            <el-input size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.code"></el-input>
          </el-form-item>
          <el-form-item label="岗位名称" prop="name">
            <el-input size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="岗位编号" prop="id">
            <el-input size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.id"></el-input>
          </el-form-item>
          <el-form-item label="岗位类型" prop="postTypeName">
            <el-input v-if="isEditPeopleForm" size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.postTypeName"></el-input>
            <el-select v-if="!isEditPeopleForm" size="mini" style="width:100%" v-model="peopleForm.postTypeId" placeholder="请选择岗位类型">
              <el-option
                v-for="item in postType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="顺序" prop="orderNum">
            <el-input size="mini" :disabled="isEditPeopleForm" v-model="peopleForm.orderNum"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button plain size="mini" @click="peopleDrawer = false">取消</el-button>
          <el-button v-if="isEditPeopleForm" type="primary" size="mini" @click="handleEditPeople">编辑</el-button>
          <el-button
            v-if="!isEditPeopleForm"
            type="primary"
            size="mini"
            @click="handleSavePeople"
          >保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  organizationChart,
  developmentChart,
  postChart,
  getOrganizationDetails,
  addOrganization,
  deleteOrganization,
  getDepartDetails,
  deletePart,
  addDepartment,
  getPeopleDetails,
  deletePeople,
  addPost
} from "@/api/organization/chart";
export default {
  data() {
    return {
      organizationName:'',
      expandOrgTableRow:[],  // 组织表格展开行
      organizeInformationList: [],
      organizationDrawer: false, // 查看组织抽屉 控制器
      isAddOrganization: false,
      organForm: {},
      organDrawerTitle: "查看组织",
      isEditOrganForm: false, // 组织表单是否可编辑
      organRules: {
        ancestorNames: [
          {
            required: true,
            message: "请填写所属组织名称",
            trigger: "blur",
          },
        ],
        representative: [
          {
            required: true,
            message: "请填写组织法定代表人",
            trigger: "blur",
          },
        ],
        establishDate: [
          {
            required: true,
            message: "请选择成立时间",
            trigger: "blur,change",
          },
        ],
        registrationNo: [
          {
            required: true,
            message: "请输入工商注册号",
            trigger: "blur,change",
          },
        ],
      },
      groupId:0,
      groupLabel:'',
      departId:0,
      departLabel:'',
      organProps:{
          children:'children',
          label:'name'
      },
      organisation: [
        {
          value: 1,
          name: "上海华谊集团",
        },
      ],
      typeOfEnterprise:[
          {
              value:0,
              label:'有限责任公司'
          }
      ],
      industryTypes:[
          {
              value:1,
              label:'化工行业'
          }
      ],
      isShowDep: false,
      departmentName: '',
      expandDepartTableRow:[],  // 部门表格展开行
      postName:'',
      expandPostTableRow:[],  // 岗位展开行
      departmentList: [],
      departDrawer: false, // 查看部门信息 控制器
      isAddDepart: false,
      departForm: {},
      departDrawerTitle: "查看部门",
      department:[
        {
          value: 1,
          name: "财务部",
        },
      ],
      departType:[
        {
          value:1,
          name:'财务'
        }
      ],
      isEditDepartForm: false, // 组织表单是否可编辑
      departRules: {
        orgName: [
          {
            required: true,
            message: "请选择所属组织名称",
            trigger: "blur",
          },
        ],
      },
      orgId: null,
      deptTypeId:1,
      deptTypeName:'',
      isShowPeople: false,
      postList: [],
      postDto: {},
      peopleDrawer: false, // 查看部门信息 控制器
      isAddPeople: false,
      peopleForm: {},
      peopleDrawerTitle: "查看岗位",
      isEditPeopleForm: false, // 组织表单是否可编辑
      peopleRules: {
        orgName: [
          {
            required: true,
            message: "请选择所属组织名称",
            trigger: "blur",
          },
        ],
      },
      peopleId: null,
      peopleGroupId:1,
      peopleGroupLabel:'',
      peopleDepartId:1,
      peopleDepartLabel:'',
      postType:[
        {
          value:0,
          label:'人才岗位'
        }
      ]
    };
  },
  computed: {
    organizationFilter(){
      let searchValue = this.organizationName
      if(searchValue){
        let treeData = this.organizeInformationList
        let handleTreeData = this.handleFilterOrgan(treeData,searchValue)
        this.setOrganExpandRow(handleTreeData)
        this.expandOrgTableRow = this.expandOrgTableRow.join(',').split(',')
        return handleTreeData
      }
      return this.organizeInformationList
    },
    departmentFilter(){
      let searchValue = this.departmentName
      if(searchValue){
        let treeData = this.departmentList
        let handleTreeData = this.handleFilterDepart(treeData,searchValue)
        this.setDepartExpandRow(handleTreeData)
        this.expandDepartTableRow = this.expandDepartTableRow.join(',').split(',')
        return handleTreeData
      }
      return this.departmentList
    },
    postFilter(){
      let searchValue = this.postName
      if(searchValue){
        let treeData = this.postList
        let handleTreeData = this.handleFilterPost(treeData,searchValue)
        this.setPostExpandRow(handleTreeData)
        this.expandPostTableRow = this.expandPostTableRow.join(',').split(',')
        return handleTreeData
      }
      return this.postList
    },
  },
  created() {
    this.getOrganizeInformation();
  },
  methods: {
    // 初始化 获取 组织信息
    getOrganizeInformation() {
      organizationChart().then((res) => {
        if (res.code === "200" || res.code === 200) {
          this.organizeInformationList = res.data || [];
        } else {
          this.$message.error("初始化失败,请刷新页面!");
          return false;
        }
      });
    },

    //  组织 树形表格数据过滤
    handleFilterOrgan(treeData, searchValue){
      if(!treeData || treeData.length === 0){
        return []
      }
      const array = []
      for(let i = 0; i < treeData.length; i += 1){
        let match = false;
        for(let pro in treeData[i]){
          if(typeof(treeData[i][pro])=='string'){
              match |= treeData[i][pro].includes(searchValue);
              if(match) break;
          }
        }
        if (this.handleFilterOrgan(treeData[i].children, searchValue).length > 0 || match ) {
          array.push({
            ...treeData[i],
            children: this.handleFilterOrgan(treeData[i].children, searchValue),
          });
        }
      }
      return array;
    },


    // 将过滤好了之后的 表格数据展开
    setOrganExpandRow(handleTreeData){
      if(handleTreeData.length) {
          for (let i of handleTreeData) {
            this.expandOrgTableRow.push(i.id)
            if(i.children.length) {
              this.setOrganExpandRow(i.children)
            }
          }
      }
    },

    //  部门 树形表格数据过滤
    handleFilterDepart(treeData, searchValue){
      if(!treeData || treeData.length === 0){
        return []
      }
      const array = []
      for(let i = 0; i < treeData.length; i += 1){
        let match = false;
        for(let pro in treeData[i]){
          if(typeof(treeData[i][pro])=='string'){
              match |= treeData[i][pro].includes(searchValue);
              if(match) break;
          }
        }
        if (this.handleFilterDepart(treeData[i].children, searchValue).length > 0 || match ) {
          array.push({
            ...treeData[i],
            children: this.handleFilterDepart(treeData[i].children, searchValue),
          });
        }
      }
      return array;
    },


    // 将过滤好了之后的 表格数据展开
    setDepartExpandRow(handleTreeData){
      if(handleTreeData.length) {
          for (let i of handleTreeData) {
            this.expandDepartTableRow.push(i.id)
            if(i.children.length) {
              this.setDepartExpandRow(i.children)
            }
          }
      }
    },

    //  岗位 树形表格数据过滤
    handleFilterPost(treeData, searchValue){
      if(!treeData || treeData.length === 0){
        return []
      }
      const array = []
      for(let i = 0; i < treeData.length; i += 1){
        let match = false;
        for(let pro in treeData[i]){
          if(typeof(treeData[i][pro])=='string'){
              match |= treeData[i][pro].includes(searchValue);
              if(match) break;
          }
        }
        if (this.handleFilterPost(treeData[i].children, searchValue).length > 0 || match ) {
          array.push({
            ...treeData[i],
            children: this.handleFilterPost(treeData[i].children, searchValue),
          });
        }
      }
      return array;
    },


    // 将过滤好了之后的 表格数据展开
    setPostExpandRow(handleTreeData){
      if(handleTreeData.length) {
          for (let i of handleTreeData) {
            this.expandPostTableRow.push(i.id)
            if(i.children.length) {
              this.setPostExpandRow(i.children)
            }
          }
      }
    },

    // 查看 组织架构详情
    handleViewTheOrganization(row) {
      getOrganizationDetails(row.id).then((res) => {
        if (res.code === "200" || res.code === 200) {
          this.organForm = res.data || {};
          this.organizationDrawer = true;
          this.isEditOrganForm = true;
        } else {
          this.$message.error("获取组织详情失败,请重试!");
          return false;
        }
      });
    },

    // 关闭查看 组织详情 抽屉
    handleCloseOrganization() {
      this.organizationDrawer = false;
    },

    // 删除 组织架构
    handleDelTheOrganization(row) {
      this.$confirm("是否确认删除此条数据", "提示", {
        iconClass: "el-icon-question",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOrganization(row.id).then((res) => {
            if (res.code === "200" || res.code === 200) {
              this.$message.success(res.msg);
              setTimeout(() => {
                this.getOrganizeInformation();
              }, 100);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 点击抽屉编辑按钮 抽屉变成可编辑状态
    handleEditOrganization() {
      this.organDrawerTitle = "编辑组织";
      this.isEditOrganForm = false;
    },

    // 新增 组织 所属组织下拉 树状节点选择 触发
    handleClickOrgNode(data){
        this.$refs.organSelect.blur()
        this.groupId = data.value
        this.groupLabel = data.name
        this.organForm.ancestorIds = this.groupId
    },

    //  新增 部门 树状节点 点击触发
    handleClickDepartSelectOrgaNode(data){
      this.$refs.departSelectOrga.blur()
      this.groupId = data.value
      this.groupLabel = data.name
      this.departForm.orgId = this.groupId
    },

    //  新增 岗位 树状节点 点击 所属组织 触发
    handleClickPeopleSelectOrgaNode(data){
      this.$refs.peopleSelectOrga.blur()
      this.peopleGroupId = data.value
      this.peopleGroupLabel = data.name
      this.peopleForm.orgId = this.peopleGroupId
      this.peopleForm.orgName = this.peopleGroupLabel
    },

    //  新增 岗位 树状节点 点击 所属部门 触发
    handleClickPeopleSelectDepartNode(data){
      this.$refs.peopleSelectDepart.blur()
      this.peopleDepartId = data.value
      this.peopleDepartLabel = data.name
      this.peopleForm.deptId = this.peopleDepartId
      this.peopleForm.deptName = this.peopleDepartLabel
    },

   // 新增 修改 部门信息时  点击 所属部门 触发
   handleClickDepartNode(data){
      this.$refs.departSelect.blur()
      this.departId = data.value
      this.departLabel = data.name
      this.departForm.parentId = this.departId
      this.departForm.parentName = this.departLabel
   },

   // 新增 修改 部门信息时  点击 部门类型 触发
   handleClickDepartTypeNode(data){
      this.$refs.departSelectType.blur()
      this.deptTypeId = data.value
      this.deptTypeName = data.name
      this.departForm.deptTypeId = this.deptTypeId
      this.departForm.deptTypeName = this.deptTypeName
   },

    // 保存 修改 组织信息
    handleSaveOrganization() {
        addOrganization(this.organForm).then(res=>{
            if(res.code ==='200' || res.code === 200){
                this.organizationDrawer = false
                this.$message.success(res.msg)
                setTimeout(() => {
                  this.getOrganizeInformation()
                }, 200);
            }else{
                this.$message.error(res.msg)
                return false
            }
        })
    },

    // 新增 组织 信息
    handleAddOrganization() {
      this.organDrawerTitle = "添加组织";
      this.isEditOrganForm = false;
      this.isAddOrganization = true;
      this.organizationDrawer = true;
    },

    //点击 组织名称 显示 部门树状图
    handleClickOrganization(row) {
      const params = {
        orgId: row.id,
      };
      this.orgId = row.id;
      developmentChart(params).then((res) => {
        if (res.code === "200" || res.code === 200) {
          this.departmentList = res.data || [];
          this.isShowDep = true;
        } else {
          this.$message.error("获取组织部门失败,请重试!");
          return false;
        }
      });
    },
    // 查看 部门 详情
    handleViewTheDepartment(row) {
      getDepartDetails(row.id).then((res) => {
        if (res.code === "200" || res.code === 200) {
          this.departForm = res.data || {};
          this.departDrawer = true;
          this.isEditDepartForm = true;
        } else {
          this.$message.error("获取部门详情失败,请重试!");
          return false;
        }
      });
    },

    // 关闭 部门 抽屉的 回调
    handleCloseDepart() {
      this.departDrawer = false;
    },

    // 删除 部门
    handleDelTheDepartment(row) {
      this.$confirm("是否确认删除此条数据", "提示", {
        iconClass: "el-icon-question",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePart(row.id).then((res) => {
            if (res.code === "200" || res.code === 200) {
              this.$message.success(res.msg);
              setTimeout(() => {
                const params = {
                  orgId: this.orgId,
                };
                developmentChart(params).then((res) => {
                  if (res.code === "200" || res.code === 200) {
                    this.departmentList = res.data || [];
                    this.isShowDep = true;
                  } else {
                    this.$message.error("获取组织部门失败,请重试!");
                    return false;
                  }
                });
              }, 100);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 点击抽屉编辑按钮 抽屉变成可编辑状态
    handleEditDepart() {
      this.departDrawerTitle = "编辑部门";
      this.isEditDepartForm = false;
    },

    // 保存 修改 组织信息
    handleSaveDepart() {
      addDepartment(this.departForm).then(res=>{
        if(res.code ==='200' || res.code === 200){
            this.departDrawer = false
            this.$message.success(res.msg)
            setTimeout(() => {
              const params = {
                orgId: this.orgId,
              };
              developmentChart(params).then((res) => {
                if (res.code === "200" || res.code === 200) {
                  this.departmentList = res.data || [];
                  this.isShowDep = true;
                } else {
                  this.$message.error("获取组织部门失败,请重试!");
                  return false;
                }
              });
            }, 100);
        }else{
            this.$message.error(res.msg)
            return false
        }
      })
    },

    // 新增 部门 信息
    handleAddDepart() {
      this.departDrawerTitle = "添加组织";
      this.isEditDepartForm = false;
      this.isAddDepart = true;
      this.departDrawer = true;
    },

    // 点击部门名称获取 部门人员
    handleClickDepartment(row) {
      this.peopleId = row.id;
      postChart(row.id).then((res) => {
        if (res.code === "200" || res.code === 200) {
          this.postList = res.data || [];
          this.isShowPeople = true;
        } else {
          this.$message.error("获取部门岗位,请重试!");
          return false;
        }
      });
    },

    // 查看 岗位 详情
    handleViewThePost(row) {
      getPeopleDetails(row.id).then((res) => {
        if (res.code === "200" || res.code === 200) {
          this.peopleForm = res.data || {};
          this.peopleDrawer = true;
          this.isEditPeopleForm = true;
        } else {
          this.$message.error("获取岗位详情失败,请重试!");
          return false;
        }
      });
    },

    // 删除岗位
    handleDelThePost(row) {
      this.$confirm("是否确认删除此条数据", "提示", {
        iconClass: "el-icon-question",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePeople(row.id).then((res) => {
            if (res.code === "200" || res.code === 200) {
              this.$message.success(res.msg);
              setTimeout(() => {
                postChart(this.peopleId).then((res) => {
                  if (res.code === "200" || res.code === 200) {
                    this.postList = res.data || [];
                    this.isShowPeople = true;
                  } else {
                    this.$message.error("获取岗位失败,请重试!");
                    return false;
                  }
                });
              }, 100);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 点击编辑 岗位
    handleEditPeople() {
      this.peopleDrawerTitle = "编辑岗位";
      this.isEditPeopleForm = false;
    },

    // 关闭 岗位 抽屉的 回调
    handleClosePeople() {
      this.peopleDrawer = false;
    },

    // 保存岗位 信息
    handleSavePeople(){
      addPost(this.peopleForm).then(res=>{
        if(res.code ==='200' || res.code === 200){
            this.peopleDrawer = false
            this.$message.success(res.msg)
            setTimeout(() => {
                postChart(this.peopleId).then((res) => {
                  if (res.code === "200" || res.code === 200) {
                    this.postList = res.data || [];
                    this.isShowPeople = true;
                  } else {
                    this.$message.error("获取岗位失败,请重试!");
                    return false;
                  }
                });
              }, 100);
        }else{
            this.$message.error(res.msg)
            return false
        }
      })
    },

    // 新增岗位信息
    handleAddPeople(){
      this.peopleDrawerTitle = "添加岗位";
      this.isEditPeopleForm = false;
      this.isAddPeople = true;
      this.peopleDrawer = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 15px;
  font-size: 14px;
  .middle {
    margin: 0 1%;
  }
  ul {
    padding: 0;
    margin: 0;
    width: 32.5%;
    border: 1px solid #e8edfc;
    list-style: none;
    .flex {
      display: flex;
      justify-content: space-between;
    }
    .title {
      background-color: #e5effe;
      padding: 10px;
      .plus {
        width: 18px;
        height: 18px;
        background-color: #026dff;
        text-align: center;
        color: #fff;
        line-height: 18px;
        font-weight: bold;
        border-radius: 3px;
        cursor: pointer;
      }
    }
    .import {
      padding: 10px;
    }
  }
  .drawer {
    height: 100%;
    position: relative;
    .el-form {
      height: 80%;
      overflow-y: auto;
    }
    .btn {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 20px;
    }
  }
}
</style>
