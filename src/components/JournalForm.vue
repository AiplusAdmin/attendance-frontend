<template>
  <v-container>
    <v-row class="white d-flex flex-row mb-1" align="center">
      <v-col cols="12" lg="2" class="pa-6">
        <div
          class="font-weight-bold grey--text text--darken-1 text-body-2 text-uppercase"
        >
          Журнал
        </div>
      </v-col>
    </v-row>
    <v-row class="white" justify="start">
      <v-col cols="12" lg="4" class="px-6">
        <v-list class="px-0 pb-6 borderbottom ">
          <v-subheader
            class="pa-0 text-body-1 text-uppercase font-weight-bold orange--text"
            >Учитель</v-subheader
          >
          <v-list-item dense inactive class="pa-0 teacher-rounded">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="mb-2 text-h6 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="currentUser.lastname"
              ></v-list-item-title>
              <v-list-item-title
                class="text-h6 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="currentUser.firstname"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row class="white">
      <v-list class="px-6 py-0">
        <v-subheader class="pa-0 text-subtitle-1 grey--text text--darken-1"
          >Период времени</v-subheader
        >
      </v-list>
    </v-row>
    <v-row class="white">
      <v-col cols="12" lg="6" class="pb-0">
        <DateModal />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-0" cols="12" lg="12">
        <v-data-table
          class="studentsTable elevation-1"
          :headers="headers"
          :items="currentRegister"
          item-key="Id"
          :expanded.sync="expanded"
          no-data-text="Нет Записи"
          @item-expanded="ShowMore"
          @click:row="highlightClickedRow"
          show-expand
          single-expand
        >
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
    <v-row class="white">
      <v-col cols="12">
        <v-list class="pa-0 listnone">
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
                v-text="'Заработная плата'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ salary }}</p>
            </v-list-item-action>
          </v-list-item>

          <v-list-item dense inactive class="pa-0">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="'Количество бумажных'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ sheetAttendance }}</p>
            </v-list-item-action>
          </v-list-item>

          <v-list-item dense inactive class="pa-0">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="text-subtitle-1 text-uppercase font-weight-bold grey--text text--darken-4"
                v-text="'Забитых онлайн'"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <p>{{ onlineAttendance }}</p>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <Loading :overlay="overlay" />
  </v-container>
</template>

<script>
import DateModal from "@/components/modal/Date2";
import Loading from "@/components/modal/Loading";

export default {
  name: "JournalForm",
  components: {
    DateModal,
    Loading,
  },
  data() {
    return {
      headers: [
        {
          text: "Группа",
          value: "GroupName",
        },
        {
          text: "Время",
          value: "Time",
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
          text: "Онлайн",
          value: "Online",
        },
        {
          text: "Кол. Учеников",
          value: "Passed",
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
      regexpandheaders: [
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
          text: "Д.з",
          value: "homework",
          sortable: false,
        },
        {
          text: "Срез",
          value: "test",
          sortable: false,
        },
        {
          text: "Активность",
          value: "lesson",
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
      expandheaders:[],
      expanded: [],
      expandedStudents: [],
      dateFrom: null,
      dateTo: null,
      lesson: 0,
      halflesson: 0,
      hour: 0,
      rate: null,
      salary: null,
      sheetAttendance: null,
      onlineAttendance: null,
      overlay: false,
    };
  },
  computed: {
    currentTeacher() {
      return this.$store.state.currentTeacher;
    },
    currentRegister() {
      return this.$store.state.currentRegister;
    },
    currentRegisterReport() {
      return this.$store.state.currentRegisterReport;
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
  },
  async mounted() {
    await this.$store.dispatch("getregisterReport", {
      teacherId: this.currentTeacher.Id,
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
    });
    let online = 0;
    let sheet = 0;
    this.currentRegisterReport.map((i) => {
      online = online + i.OnlineLessons;
      sheet = sheet + i.PaperLessons;
    });
    this.sheetAttendance = sheet;
    this.onlineAttendance = online;
    this.rate = await this.$store.dispatch(
      "GetTeacherRate",
      this.currentTeacher.Id
    );
    this.CalculateDays();
  },
  created() {
    if (Object.entries(this.currentTeacher).length === 0)
      this.$store.state.currentTeacher = JSON.parse(
        localStorage.currentTeacher
      );
  },
  methods: {
    async ShowMore(value) {
      if (value.value) {
        var response = null;
        if(value.item.Source == 'Registers'){
          this.expandheaders = this.regexpandheaders;
          response = await this.$store.dispatch("GetRegisterDetails", {
            registerId: value.item.Id,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
          });
        } else if(value.item.Source == 'BumRegisters'){
          this.expandheaders = this.regexpandheaders;
          response = await this.$store.dispatch("GetBumRegisterDetails", {
            registerId: value.item.Id,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
          });
        }else if(value.item.Source == 'DopRegisters'){
          this.expandheaders = this.dopexpandheaders;
          response = await this.$store.dispatch("GetDopRegisterDetails", {
            registerId: value.item.Id,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
          });
        }

        if (response.status == 200) {
          this.expandedStudents = response.data;
        } else {
          this.$router.push("/");
        }
      }
    },
    highlightClickedRow(value) {
      const tr = value.target.parentNode;
      tr.classList.add("highlight");
    },
    addDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 1);
      return date.toISOString().substr(0, 10);
    },
    async CalculateDays() {
      var lesson = 0;
      var halflesson = 0;
      var hour = 0;
      var hash = new Array();
      this.currentRegister.map(function(register) {
        if (!(register.LessonDate in hash)) {
          hash[register.LessonDate] = new Array();
          hash[register.LessonDate].push(register.Time);
          var arrTime = register.Time.split("-");
          var arrStart = arrTime[0].split(":");
          var arrEnd = arrTime[1].split(":");
          var time = (arrEnd[0] - arrStart[0]) * 60 + (arrEnd[1] - arrStart[1]);

          if (time == 90) {
            if (register.Passed == 0) lesson = lesson + 0.5;
            else lesson = lesson + 1;
          } else if (time == 50 || time == 55 || time == 60) {
            if (register.Passed == 0) hour = hour + 0.5;
            else hour = hour + 1;
          } else if (time == 45 || time == 40) {
            if (register.Passed == 0) halflesson = halflesson + 0.5;
            else halflesson = halflesson + 1;
          } else if (time == 120) {
            if (register.Passed == 0) hour = hour + 1;
            else hour = hour + 2;
          } else {
            console.log("Время проблемное ", time, register);
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
            } else if (time == 50 || time == 55 || time == 60) {
              if (register.Passed == 0) hour = hour + 0.5;
              else hour = hour + 1;
            } else if (time == 45 || time == 40) {
              if (register.Passed == 0) halflesson = halflesson + 0.5;
              else halflesson = halflesson + 1;
            } else if (time == 120) {
              if (register.Passed == 0) hour = hour + 1;
              else hour = hour + 2;
            } else {
              console.log("Время проблемное ", register);
            }
          }
        }
      });

      this.lesson = lesson;
      this.halflesson = halflesson;
      this.hour = hour;
      this.salary = this.rate
        ? this.lesson * this.rate.Rate90 +
          (this.halflesson * this.rate.Rate90) / 2 +
          this.hour * this.rate.Rate60
        : "";
    },
  },
  watch: {},
};
</script>

<style scoped>
.borderbottom {
  border-bottom: 1px solid #fbab17;
}
</style>
