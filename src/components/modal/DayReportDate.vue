<template>
	<v-container>
				<v-row>
			<v-col cols="6" lg="6">
				<v-menu
					ref="menuFrom"
					v-model="menuFrom"
					:close-on-content-click="false"
					:return-value.sync="dateFrom"
					transition="scale-transition"
					offset-y
					max-width="290px"
					min-width="290px">
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="dateFrom"
							label="Дата"
							color="#fbab17"
							prepend-icon="mdi-calendar-multiple"
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker
						v-model="dateFrom"
						type="date"
						locale="ru"
						color="#fbab17"
						first-day-of-week="1"
						no-title>
						<v-spacer></v-spacer>
						<v-btn text color="orange" @click="menuFrom = false">ОТМЕНИТЬ</v-btn>
						<v-btn text color="orange" @click="GetDayReport">ОК</v-btn>
					</v-date-picker>
				</v-menu>
			</v-col>
		</v-row>
	</v-container>
	
</template>

<script>
export default {
	name: 'DayReportDateModal',
	data(){
		return{
			dateFrom: new Date().toISOString().substr(0, 10),
			menuFrom: false,
			modalFrom: false,
		}
	},
	mounted(){
		this.$parent.dateFrom = this.dateFrom;
	},
	methods:{
		async GetDayReport(){
			this.$parent.$parent.dateFrom = this.dateFrom;
			await this.$store.dispatch('GetDayReport',{ dateFrom: this.dateFrom});
			this.$refs.menuFrom.save(this.dateFrom);
			this.menuFrom = false;
		}
	}
}
</script>