<template>
  <v-container>
    <v-row class="d-flex flex-row" align="center">
      <v-col cols="12" lg="2">
        <div class="font-weight-bold text-lg-h5">Attendance list</div>
      </v-col>
    </v-row>
    <v-row class="white" justify="start">
      <v-col cols="12" lg="6">
        <OneDateModal />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-0" cols="12" lg="12">
        <v-data-table
          class="elevation-1 studentsTable"
          :headers="headers"
          :items="filteredDesserts"
          item-key="Id"
          :expanded.sync="expanded"
          :search="search"
          @item-expanded="ShowMore"
          no-data-text="Нет Записи"
          show-expand
          single-expand
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Поиск"
                    color="#fbab17"
                    @input="CalculateDaysSearch"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-toolbar>
            <v-row class="align-center justify-space-around px-2">
              <v-col
                class="pt-6 pb-0"
                v-for="header in filterHeaders"
                :key="header.text"
              >
                <v-select
                  v-if="header.value == 'FullName'"
                  rounded
                  outlined
                  flat
                  multiple
                  clearable
                  dense
                  color="#fbab17"
                  :label="header.text"
                  :items="columnValueList(header.value)"
                  item-color="#fbab17"
                  no-data-text="Нет данных"
                  @change="CalculateDays"
                  @click:clear="Clear"
                  v-model="filters[header.value]"
                >
                </v-select>
                <v-select
                  v-else
                  rounded
                  outlined
                  flat
                  multiple
                  clearable
                  dense
                  color="#fbab17"
                  :label="header.text"
                  :items="columnValueList(header.value)"
                  no-data-text="Нет данных"
                  item-color="#fbab17"
                  @click:clear="Clear"
                  v-model="filters[header.value]"
                >
                </v-select>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.Fine`]="{ item }">
            <v-select
              v-model="item.Fine"
              :items = 'lateMinutes'
              type="text"
              color="#fbab17"
              @change="addFine(item)"
            >
            </v-select>
          </template>
          <template v-slot:[`item.Online`]="{ item }">
            <td v-if="(item.Source == 'Registers' && item.Online == true) || item.Source == 'DopRegisters'">
              Онлайн
            </td>
            <td v-else>
              Бумажный
            </td>
          </template>
          <template v-slot:expanded-item="{ headers }">
            <td class="px-0" :colspan="headers.length">
              <v-data-table
                :headers="expandheaders"
                :items="expandedStudents"
                hide-default-footer
                disable-pagination
              >
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-if="currentUser.roleId == 5" class="white">
      <v-col cols="12">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  Минут
                </th>
                <th>
                  Ставка
                </th>
                <th>
                  Количество
                </th>
                <th>
                  Итог
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>90</td>
                <td>{{ rate90 }}</td>
                <td>{{ lesson }}</td>
                <td>{{ rate90 * lesson }}</td>
              </tr>
              <tr>
                <td>60</td>
                <td>{{ rate60 }}</td>
                <td>{{ hour }}</td>
                <td>{{ rate60 * hour }}</td>
              </tr>
              <tr>
                <td>45</td>
                <td>{{ rate90 / 2 }}</td>
                <td>{{ halflesson }}</td>
                <td>{{ (rate90 / 2) * halflesson }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ salary }}</td>
              </tr>
              <tr>
                <td>Заменяли</td>
                <td></td>
                <td></td>
                <td>{{ change }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row v-else class="white">
      <v-col cols="12">
        <v-list class="pa-0 listnone">
          <v-subheader
            class="pa-0 text-subtitle-2 text-uppercase font-weight-bold grey--text text--darken-2"
            >Тренер</v-subheader
          >
          <v-list-item dense inactive class="pa-0 teacher-rounded">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="teacherSearch"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense inactive class="pa-0">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="'90 минут'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ lesson }}</p>
            </v-list-item-action>
          </v-list-item>
          <v-list-item dense inactive class="pa-0">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="'45 минут'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ halflesson }}</p>
            </v-list-item-action>
          </v-list-item>
          <v-list-item dense inactive class="pa-0">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="'60 минут'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ hour }}</p>
            </v-list-item-action>
          </v-list-item>
          <v-list-item dense inactive class="pa-0">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="'Тренера заменяли'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ change }}</p>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OneDateModal from "@/components/modal/OneDate";

export default {
  name: "AllJournalForm",
  components: {
    OneDateModal,
  },
  data() {
    return {
      headers: [
        {
          text: "Id",
          value: "Id",
        },
        {
          text: "Филиал",
          value: "Name",
          filterable: true,
        },
        {
          text: "Отделение",
          value: "Branch",
          filterable: true,
        },
        {
          text: "Класс",
          value: "Klass",
          filterable: true,
        },
        {
          text: "Группа",
          value: "GroupName",
          filterable: true,
        },
        {
          text: "Предмет",
          value: "Subject",
          filterable: true,
        },
        {
          text: "Время",
          value: "Time",
          filterable: true,
        },
        {
          text: "Дни обучения",
          value: "WeekDays",
        },
        {
          text: "Дата Урока",
          value: "LessonDate",
        },
        {
          text: "Дата Сабмита",
          value: "SubmitDay",
        },
        {
          text: "Время Сабмита",
          value: "SubmitTime",
        },
        {
          text: "Преподаватель",
          value: "FullName",
          filterable: true,
        },
        {
          text: "Кабинет",
          value: "Room",
          filterable: true,
        },
        {
          text: "Уровень среза",
          value: "LevelTest",
          filterable: true,
        },
        {
          text: "Айбаксы",
          value: "Aibucks",
        },
        {
          text: "Тема Урока",
          value: "Topic",
        },
        {
          text: "Заменяемый Препод",
          value: "SubFullName",
          filterable: true,
        },

        {
          text: "Кол. Учеников",
          value: "Passed",
        },
        {
          text: "Онлайн",
          value: "Online",
          filterable: true,
        },
        {
          text: "Общ. Кол. Учеников",
          value: "All",
        },
        {
          text: "Опоздание (мин.)",
          value: "Fine",
        },
        {
          text: "",
          value: "data-table-expand",
        },
      ],
      filters: {
        Name: [],
        GroupName: [],
        Subject: [],
        Time: [],
        FullName: [],
        Branch: [],
        LevelTest: [],
        Room: [],
        SubFullName: [],
        Online: [],
      },
      regexpandheaders: [
        {
          text: "ID",
          value: "ClientId",
          sortable: false,
          divider: true,
        },
        {
          text: "ФИО студента",
          value: "FullName",
          sortable: false,
          divider: true,
        },
        {
          text: "Присутвовал",
          value: "Pass",
          sortable: false,
          divider: true,
        },
        {
          text: "Д.з",
          value: "homework",
          sortable: false,
          divider: true,
        },
        {
          text: "Срез",
          value: "test",
          sortable: false,
          divider: true,
        },
        {
          text: "Активность",
          value: "lesson",
          sortable: false,
          divider: true,
        },
        {
          text: "Комментарии",
          value: "Comment",
          sortable: false,
          divider: true,
        },
      ],
      dopexpandheaders: [
        {
          text: "ID",
          value: "ClientId",
          sortable: false,
        },
        {
          text: "ФИО студента",
          value: "FullName",
          sortable: false,
        },
        {
          text: "Присутвовал",
          value: "Pass",
          sortable: false,
        },
        {
          text: "Задачи",
          value: "task",
          sortable: false,
        },
        {
          text: "Задачи Максимум",
          value: "taskmax",
          sortable: false,
        },
        {
          text: "Закрытия темы",
          value: "complition",
          sortable: false,
        },
        {
          text: "Комментарии",
          value: "Comment",
          sortable: false,
        },
        {
          text: "Айбаксы",
          value: "Aibucks",
          sortable: false,
        },
      ],
      expandheaders: [],
      search: "",
      expanded: [],
      expandedStudents: [],
      dateFrom: null,
      dateTo: null,
      lesson: 0,
      halflesson: 0,
      hour: 0,
      change: 0,
      teacherSearch: "",
      salary: 0,
      rate90: 0,
      rate60: 0,
    };
  },
  computed: {
    adminRegisters() {
      return this.$store.state.adminRegisters;
    },
    filterHeaders: function() {
      return this.headers.filter(function(header) {
        return header.filterable;
      });
    },
    filteredDesserts() {
      return this.adminRegisters.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
    lateMinutes(){
      return this.$store.state.lateMinutes;
    }
  },
  beforeCreate() {
    var user = JSON.parse(window.localStorage.currentUser);
    if (Object.keys(user).length === 0 && user.constructor === Object) {
      this.$router.push("/");
    }
  },
  created() {
    if (localStorage.currentUser)
      this.$store.state.currentUser = JSON.parse(localStorage.currentUser);
  },
  async mounted() {
    await this.$store.dispatch("GetRegisterToAdmin", {
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
    });
  },
  methods: {
    columnValueList(val) {
      var s = this.adminRegisters.map((d) => d[val]);
      if (val == "FullName" || val == "SubFullName") {
        return s.sort();
      } else if (val == "Time") {
        return s.sort(this.compareTimes);
      } else {
        return s;
      }
    },
    async ShowMore(value) {
      if (value.value) {
        var response = null;
        if(value.item.Source == 'Registers'){
          this.expandheaders = this.regexpandheaders;
          response = await this.$store.dispatch("GetRegisterDetails", {
            registerId: value.item.Id
          });
        }else if(value.item.Source == 'BumRegisters'){
          this.expandheaders = this.regexpandheaders;
          response = await this.$store.dispatch("GetBumRegisterDetails", {
            registerId: value.item.Id
          });
        }else if(value.item.Source == 'DopRegisters'){
          this.expandheaders = this.dopexpandheaders;
          response = await this.$store.dispatch("GetDopRegisterDetails", {
            registerId: value.item.Id
          });
        }
        if (response.status == 200) {
          this.expandedStudents = response.data;
        } else {
          this.$router.push("/");
        }
      }
    },
    addFine(item) {
      this.$store.dispatch("UpdateRegiterFine", item);
    },
    CalculateDays() {
      var lesson = 0;
      var halflesson = 0;
      var hour = 0;
      var teacher = this.filters.FullName[0] ? this.filters.FullName[0] : null;
      this.teacherSearch = this.filters.FullName[0]
        ? this.filters.FullName[0]
        : null;
      var hash = new Array();
      if (teacher) {
        this.rate90 = this.filteredDesserts[0].Rate90;
        this.rate60 = this.filteredDesserts[0].Rate60;
        this.filteredDesserts.map(function(register) {
          if (!(register.LessonDate in hash)) {
            hash[register.LessonDate] = new Array();
            hash[register.LessonDate].push(register.Time);
            var arrTime = register.Time.split("-");
            var arrStart = arrTime[0].split(":");
            var arrEnd = arrTime[1].split(":");
            var time =
              (arrEnd[0] - arrStart[0]) * 60 + (arrEnd[1] - arrStart[1]);

            if (time == 90) {
              if (register.Passed == 0) lesson = lesson + 0.5;
              else lesson = lesson + 1;
            } else if (time == 60) {
              if (register.Passed == 0) hour = hour + 0.5;
              else hour = hour + 1;
            } else if (time == 45 || time == 40){
              if (register.Passed == 0) halflesson = halflesson + 0.5;
              else halflesson = halflesson + 1;
            }else if (time == 120) {
              if (register.Passed == 0) hour = hour + 1;
              else hour = hour + 2;
            }else{
              console.log('Время проблемное ',register);
            }
          } else {
            if (hash[register.LessonDate].includes(register.Time)) {
              console.log(
                `${register.LessonDate} уже есть урок за ${register.Time}`
              );
            } else {
              hash[register.LessonDate].push(register.Time);
              arrTime = register.Time.split("-");
              arrStart = arrTime[0].split(":");
              arrEnd = arrTime[1].split(":");
              time = (arrEnd[0] - arrStart[0]) * 60 + (arrEnd[1] - arrStart[1]);

              if (time == 90) {
                if (register.Passed == 0) lesson = lesson + 0.5;
                else lesson = lesson + 1;
              } else if (time == 60) {
                if (register.Passed == 0) hour = hour + 0.5;
                else hour = hour + 1;
              } else if (time == 45 || time == 40){
                if (register.Passed == 0) halflesson = halflesson + 0.5;
                else halflesson = halflesson + 1;
              }else if (time == 120) {
                if (register.Passed == 0) hour = hour + 1;
                else hour = hour + 2;
              }else{
                console.log('Время проблемное ',register);
              }
            }
          }
        });
        var changeFilter = this.adminRegisters.filter(
          (elem) => elem.SubFullName == teacher
        );
        this.lesson = lesson;
        this.halflesson = halflesson;
        this.hour = hour;
        this.salary =
          this.lesson * this.rate90 +
          (this.halflesson * this.rate90) / 2 +
          this.hour * this.rate60;
        this.change = changeFilter.length;
      }
    },
    CalculateDaysSearch(teacher) {
      this.teacherSearch = teacher;
      var lesson = 0;
      var halflesson = 0;
      var hour = 0;
      this.filteredDesserts.map(function(register) {
        var arrTime = register.Time.split("-");
        var arrStart = arrTime[0].split(":");
        var arrEnd = arrTime[1].split(":");
        var time = (arrEnd[0] - arrStart[0]) * 60 + (arrEnd[1] - arrStart[1]);
        if (time == 90) {
          lesson = lesson + 1;
        } else if (time == 60) {
          hour = hour + 1;
        } else {
          halflesson = halflesson + 1;
        }
      });
      var changeFilter = this.adminRegisters.filter((elem) =>
        elem.SubFullName.includes(teacher)
      );
      this.lesson = lesson;
      this.halflesson = halflesson;
      this.hour = hour;
      this.change = changeFilter.length;
    },
    Clear() {
      this.filteredDesserts = this.adminRegisters;
    },
    compareTimes(a, b) {
      if (a.begin < b.begin) {
        return -1;
      }
      if (a.begin > b.begin) {
        return 1;
      }
      if (a.begin == b.begin && a.end < b.end) {
        return -1;
      }
      if (a.begin == b.begin && a.end > b.end) {
        return 1;
      }
      return 0;
    },
  },
};
</script>

<style scoped></style>
