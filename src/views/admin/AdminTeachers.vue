<template>
	<v-container>
		<v-data-table
			:headers="headers"
			:items="adminItems"
			:search="search"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Преповадатели</v-toolbar-title>
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
					<v-btn
						color="#fbab17"
						dark
						class="ml-4 mb-2"
						@click="AddTeachersHH"
					>
						Добавить Преповадателей
					</v-btn>
					<v-spacer></v-spacer>
					<v-dialog
						v-model="dialog"
						max-width="500px"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="#fbab17"
								dark
								class="mb-2"
								v-bind="attrs"
								v-on="on"
							>
								Добавить
							</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>
							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.FirstName"
												label="Имя"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.LastName"
												label="Фамилия"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.MiddleName"
												label="Отчество"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Email"
												label="Логин"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Phone"
												label="Телефон"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Mobile"
												label="Моб. Тел."
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Mail"
												label="Почта"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Address"
												label="Адрес"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Rate60"
												label="Ставка за 60 минут"
												color="#fbab17"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.Rate90"
												label="Ставка за 90 минут"
												color="#fbab17"
											></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
								color="#fbab17"
								text
								@click="close"
								>
									Отмена
								</v-btn>
								<v-btn
								color="#fbab17"
								text
								@click="save"
								>
									Сохранить
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="headline">Вы уверены ?</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="#fbab17" text @click="closeDelete">Отмена</v-btn>
								<v-btn color="#fbab17" text @click="deleteItemConfirm">Удалить</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-row class="pa-2">
						<v-icon small color="#fbab17" class="mr-1" @click="editItem(item)">mdi-pencil</v-icon>
						<v-icon small  color="#fbab17" @click="deleteItem(item)">mdi-delete</v-icon>
				</v-row>
			</template>
		</v-data-table>
		<Loading :overlay="overlay"/>
	</v-container>
</template>

<script>
import Loading from '@/components/modal/Loading'

export default {
	components: {
		Loading
	},
	data(){
		return {
			dialog: false,
			editedItem: [],
			deletedItem: {},
			editedIndex: -1,
			deletedIndex: -1,
			dialogDelete: false,
			defaultItem: {},
			search: '',
			overlay: false,
			headers:[
				{
					text: 'Id',
					value: 'Id'
				},
				{
					text: 'TeacherId',
					value: 'TeacherId'
				},
				{
					text: 'Имя',
					value: 'FirstName'
				},
				{
					text: 'Фамилия',
					value: 'LastName'
				},
				{
					text: 'Отчество',
					value: 'MiddleName'
				},
				{
					text: 'Логин',
					value: 'Email'
				},
				{
					text: 'Телефон',
					value: 'Mobile'
				},
				{
					text: 'Моб. Тел.',
					value: 'Phone'
				},
				{
					text: 'Почта',
					value: 'Mail'
				},
				{
					text: 'Адрес',
					value: 'Address'
				},
				{
					text: 'Ставка за 60 минут',
					value: 'Rate60'
				},
				{
					text: 'Ставка за 90 минут',
					value: 'Rate90'
				},
				{
					text: 'Action',
					value: 'actions'
				}
			]
		}
	},
	mounted(){
		this.$store.dispatch('GetTableColumns',this.adminTable.Router);
	},
	computed:{
		adminTable(){
			return this.$store.state.adminTable;
		},
		adminItems(){
			return this.$store.state.adminItems;
		},
		formTitle () {
			return this.editedIndex === -1 ? 'Создать' : 'Редактировать'
		},
	},
	methods:{
		editItem (item) {
			this.editedIndex = this.adminItems.indexOf(item);
			this.editedItem =  Object.assign({}, item);
			this.dialog = true;
		},
		deleteItem (item) {
			this.deletedIndex = this.adminItems.indexOf(item);
			this.deletedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},
		deleteItemConfirm () {
			this.adminItems.splice(this.deletedIndex, 1);
			this.$store.dispatch('AdminDelete',{router: this.adminTable.Router, Id: this.deletedItem.Id});
			this.closeDelete();
		},
		close () {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},
		closeDelete () {
			this.dialogDelete = false;
			this.$nextTick(() => {
				this.deletedItem = Object.assign({}, this.defaultItem)
				this.deletedIndex = -1
			});
		},

		save () {
			if (this.editedIndex > -1) {
				Object.assign(this.adminItems[this.editedIndex],this.editedItem);
				this.$store.dispatch('AdminEdit',{router: this.adminTable.Router, item: this.editedItem});
			} else {
				this.desserts.push(this.editedItem);
			}
			this.close();
		},
		async AddTeachersHH(){
			this.overlay = true;
			await this.$store.dispatch('AddTeachersHH');
			this.overlay = false;
		}
	}
}
</script>