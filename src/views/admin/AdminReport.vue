<template>
	<v-container>
		<v-row class="white" justify="start">
      <v-col cols="12" lg="6">
        <ReportDateModal />
      </v-col>
    </v-row>
		<v-data-table
			:headers="headers"
			:items="adminItems"
			:search="search"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Отчёт</v-toolbar-title>
					<v-divider
						class="mx-4"
						inset
						vertical
					></v-divider>
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						label="Поиск"
						color="#fbab17"
						single-line
						hide-details
					></v-text-field>
					<v-spacer></v-spacer>
					<v-dialog
						v-model="dialog"
						max-width="500px"
					>
						
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>
						</v-card>
					</v-dialog>
					
				</v-toolbar>
			</template>
			
		</v-data-table>
	</v-container>
</template>

<script>
import ReportDateModal from "@/components/modal/ReportDate";
export default {
	components: {
    ReportDateModal,
  },
	data(){
		return {
			dialog: false,
			editedItem: {},
			search: '',
			headers:[
				{
					text: 'Дата',
					value: 'LessonDate'
				},
				{
					text: 'Все уроки',
					value: 'AllLessons'
				},
				{
					text: 'Групповые',
					value: 'Group'
				},
				{
					text: 'Пустые групповые',
					value: 'EmpGroup'
				},
				{
					text: 'Индивы',
					value: 'Ind'
				},
				{
					text: 'Пустые индивы',
					value: 'EmpInd'
				},
				{
					text: 'Замены',
					value: 'Change'
				},
				{
					text: 'Айбаксы',
					value: 'Aibucks'
				},
				{
					text: 'Айбаксы за урок',
					value: 'AibucksPerLess'
				},
				{
					text: 'Бумажные',
					value: 'Paper'
				},
				{
					text: 'Дата сабмита другая',
					value: 'SubmitTimeDiff'
				},
				{
					text: 'Сдали позже 19:00',
					value: 'SubmitAfter'
				},
				{
					text: 'Заполнили 2 раза',
					value: 'DoubleSubmit'
				}
			],
		}
	},
	async mounted(){
		await this.$store.dispatch("GetGeneralReport", {
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
    });
	},
	computed:{
		adminTable(){
			return this.$store.state.adminTable;
		},
		adminItems(){
			return this.$store.state.adminItems;
		},	
	},
	
}
</script>