<template>
	<div class="wrap" :class="{'WrapShow':WrapShow}">
		<h1>用户的登陆记录</h1>
		<div id="table" style="margin-top: 15px;">
			<el-table
					:data="tableData"
					border
					size="mini"
					ref="filterTable"
					:fit="true"
					:default-sort="{prop: 'date', order: 'descending'}"
					style="width: 100%"
					:cell-style="{padding:'0px'}"
					:height="tableOffset"
			>
				<template v-for="item in columnsData">
					<el-table-column
							:key="item"
							:prop="item"
							:label="item"
							sortable
							show-overflow-tooltip
							:min-width="120"
							align="center"
					/>
				</template>
			</el-table>
			<el-pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[ 10, 20, 50,100]"
					:page-size="pagesize"
					:total="tableCount">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				columnsData:[],
				tableCount:0,
				currentPage: 1,
				pageSize: 20,
				curPage: 1,
				pagesize: 20,
				tableData: [],
				tableOffset:null
			}
		},
		computed: {
			/**
			 * @return {boolean}
			 */
			WrapShow() {
				return !this.$store.state.NavShow;
			}
		},
		mounted() {
			this.getTableCounmns();
			let offsetTop = document.getElementById('table').offsetTop - 50 || document.body.scrollTop - 50;
			let wrapH = document.getElementsByClassName('wrap')[0].clientHeight - 50;
			this.tableOffset = wrapH - offsetTop - 32;
		},
		methods:{
			getTableCounmns(){
				this.$http({
					url: "TableFiled",
					data: {
						"tableName": "History"
					}
				}).then(res => {
					this.columnsData = [];

					for(let item in res){
						this.columnsData.push(res[item]);
					}
					this.getTableData();
				});
			},
			getTableData(pageSize, curPage){
				this.$http({
					url:'History',
					data:{
						"PageSize": pageSize ? pageSize : "20",
						"CurPage": curPage ? curPage : "1"
					}
				}).then(res=>{
					this.tableCount = res.data['total'];
					this.tableData = [];
					res.data['rows'] = JSON.parse(res.data['rows']);
					for (let i = 0; i < res.data['rows'].length; i++) {
						res.data['rows'][i]['事件时间'] = this.formateTime(res.data['rows'][i]['事件时间']);
						this.tableData.push(res.data['rows'][i]);
					}
				})
			},
			handleCurrentChange: function (currentPage) {
				this.currentPage = currentPage;
				this.getTableData(this.pagesize, this.currentPage);
			},
			handleSizeChange: function (size) {
				this.pagesize = size;
				this.currentPage = 1;
				this.getTableData(this.pagesize, this.currentPage);
			},
			formateTime(time) {
				if (time) {
					var datetime = new Date(time);
					var year = datetime.getFullYear();
					var month = datetime.getMonth() + 1;
					var date = datetime.getDate();
					var hour = datetime.getHours() > 9 ? datetime.getHours() : '0' + datetime.getHours();
					var min = datetime.getMinutes() > 9 ? datetime.getMinutes() : '0' + datetime.getMinutes();
					return year + '/' + month + '/' + date + ' ' + hour + ':' + min;
				}
			}
		}
	}
</script>

