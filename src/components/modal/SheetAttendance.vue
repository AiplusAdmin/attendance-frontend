<template>
  <v-row class="d-flex justify-center" style="padding:12px;">
    <v-dialog v-model="dialog" persistent max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="rounded-btn-orange white--text"
          block
          rounded
          height="50"
          style="margin-top: 15px;"
        >
          Нет группы
        </v-btn>
      </template>
      <v-card class="rounded-card py-2 px-5">
        <v-form v-model="valid" ref="form" class="pb-4">
          <v-card-title class="pb-2 d-flex justify-center align-center">
            <span class="pl-4 font-weight-bold text-h5">Бумажный</span>
            <v-icon class="ml-auto" @click="Cancel">mdi-close-thick</v-icon>
          </v-card-title>
          <v-divider></v-divider>

          <v-list-item class="py-2">
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Тип обучения</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-select
                  v-model="params.ind"
                  :items="ind"
                  color="#fbab17"
                  item-text="text"
                  item-value="value"
                  flat
                  dense
                  hide-details
                  return-object
                  required
                >
                </v-select>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Филиал</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-select
                  v-model="params.office"
                  :items="groupOffices"
                  color="#fbab17"
                  item-text="Name"
                  flat
                  dense
                  hide-details
                  return-object
                  :rules="[requiredObject('Филиал')]"
                  required
                >
                </v-select>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Предмет</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-select
                  v-model="params.discipline"
                  :items="themes"
                  color="#fbab17"
                  item-text="name"
                  item-value="id"
                  flat
                  dense
                  hide-details
                  return-object
                  :rules="[requiredObject('Предмет')]"
                  required
                >
                </v-select>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Класс</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-select
                  v-model="params.groupClass"
                  :items="classes"
                  color="#fbab17"
                  item-text="text"
                  item-value="value"
                  flat
                  dense
                  hide-details
                  return-object
                  :rules="[required('Класс')]"
                  required
                >
                </v-select>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Отделение</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-select
                  v-model="params.branch"
                  :items="branches"
                  color="#fbab17"
                  item-text="text"
                  item-value="value"
                  flat
                  dense
                  hide-details
                  return-object
                  :rules="[requiredObject('Отделение')]"
                  required
                >
                </v-select>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Начало</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content
                ><v-select
                  v-model="params.beginTime"
                  :items="timesFrom"
                  @change="changeTimeFrom"
                  label="00:00"
                  color="#fbab17"
                  item-text="text"
                  item-value="value"
                  flat
                  dense
                  hide-details
                  return-object
                  :rules="[required('Начало')]"
                  required
                >
                </v-select
              ></v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Окончание</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content
                ><v-select
                  v-model="params.endTime"
                  :items="timesTo"
                  label="00:00"
                  color="#fbab17"
                  item-text="text"
                  item-value="value"
                  flat
                  dense
                  hide-details
                  return-object
                  :rules="[required('Окончание')]"
                  required
                >
                </v-select
              ></v-list-item-content>
            </v-col>
          </v-list-item>

          <v-list-item class="py-2" inactive>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold grey--text text--darken-2"
                  >Дни обучения</v-list-item-title
                >
              </v-list-item-content>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-list-item-content>
                <v-select
                  v-model="params.days"
                  :items="days"
                  color="#fbab17"
                  item-color="#fbab17"
                  item-text="Name"
                  flat
                  dense
                  hide-details
                  multiple
                  return-object
                  :rules="[requiredObject('Дни обучения')]"
                  required
                >
                </v-select>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <h4
            class="py-2"
            style="color: red; margin-left: 15px;"
            v-if="errorMessage"
          >
            В это время уже есть группа, проверьте введенные данные
          </h4>

          <v-card-actions class="px-0">
            <v-btn
              class="rounded-btn-orange white--text"
              :loading="click"
              :height="48"
              @click="Save"
              block
              rounded
              >Сохранить</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import validations from "@/utils/validations";

export default {
  name: "Edit",
  props: ["teacherId"],
  data() {
    return {
      valid: true,
      dialog: false,
      path: null,
      messageModal: "",
      click: false,
      errMessageRepeat: "",
      groupOffices: [],
      groupClass: null,
      days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      classes: ["4", "5", "6"],
      theme: null,
      themes: [
        {
          id: "L",
          name: "Логика",
        },
        {
          id: "M",
          name: "Математика",
        },
        {
          id: "K",
          name: "Казахский язык",
        },
        {
          id: "R",
          name: "Русский язык",
        },
        {
          id: "N",
          name: "Началка",
        },
        {
          id: "F",
          name: "Физика",
        },
        {
          id: "CH",
          name: "Химия",
        },
        {
          id: "E",
          name: "Английский язык",
        },
        {
          id: "B",
          name: "Биология",
        },
        {
          id: "HK",
          name: "История Казахстана",
        },
        {
          id: "G",
          name: "География",
        },
        {
          id: "MG",
          name: "Математическая Грамотность",
        },
        {
          id: "CHOP",
          name: "Человек.Общество.Право.",
        },
        {
          id: "GM",
          name: "Геометрия",
        },
        {
          id: "I",
          name: "Информатика",
        },
      ],
      branch: null,
      branches: [
        {
          id: "KO",
          text: "Казахское",
        },
        {
          id: "RO",
          text: "Русское",
        },
      ],
      timeFrom: null,
      timeTo: null,
      ind: [
        {
          text: "Индивидуально",
          value: true,
        },
        {
          text: "Группа",
          value: false,
        },
      ],
      errorMessage: false,
      params: {
        ind: { value: false },
        office: null,
        teacherId: null,
        discipline: null,
        groupClass: null,
        branch: null,
        endTime: null,
        beginTime: null,
        days: null,
      },
      ...validations,
    };
  },
  async mounted() {
    this.params.teacherId = this.teacherId;
    this.groupOffices = await this.$store.dispatch("GetOfficesHH");
  },
  computed: {
    offices() {
      return this.$store.state.offices;
    },
    currentTeacher() {
      return this.$store.state.currentTeacher;
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
    timesFrom() {
      return this.$store.state.timesFrom;
    },
    timesTo() {
      return this.$store.state.timesTo;
    },
  },
  methods: {
    async changeTimeFrom() {
      this.errorMessage = false;
      this.params.endTime = null;
      await this.$store.dispatch("changeTimesTo", this.params.beginTime);
    },

    SetGroup(office, group) {
      this.overlay = true;
      group.date = new Date().toISOString().substr(0, 10);
      group.change = false;
      group.officeId = office.Id;
      group.officeName = office.Name;
      group.teacherId = this.teacherId;
      group.subteacherId = null;
      this.$store.dispatch("SetGroup", group);
      this.overlay = false;
      if (group.klass >= 0 && group.klass < 4) {
        this.$router.push({ path: "/groupn" });
      } else if (group.klass >= 4 && group.klass <= 6) {
        this.$router.push({ path: "/groupt" });
      } else if (this.$store.state.currentGroup.klass >= 10) {
        this.$router.push({ path: "/groupe" });
      } else {
        this.$router.push({ path: "/group" });
      }
    },

    setGroupName(discipline, groupClass, branch, timeFrom, block, ind) {
      let word;

      if (timeFrom < "14:00") {
        word = "U";
      } else {
        word = "V";
      }
      if (ind.value == true) {
        return `IND.${discipline.id}.${groupClass}.${branch}${word}`;
      }
      if (block) {
        return `${discipline.id}.${groupClass}.${branch}${word}.${block}`;
      } else {
        return `${discipline.id}.${groupClass}.${branch}${word}`;
      }
    },

    Cancel() {
      this.dialog = false;
      this.params = {};
    },
    async Save() {
      if (this.valid) {
        if (this.currentUser.teacherId == undefined) this.$router.push("/");
        else {
          let response = await this.$store.dispatch("TimeCheck", {
            teacherId: this.params.teacherId,
            beginTime: this.params.beginTime,
            endTime: this.params.endTime,
          });
          if (response.data.status == 200) {
            this.errorMessage = false;
            this.SetGroup(this.params.office, {
              begin: this.params.beginTime,
              end: this.params.endTime,
              branch: this.params.branch.text == "Казахское" ? "КО" : "РО",
              days: this.params.days.join(","),
              inweek: this.params.days.length,
              klass: this.params.groupClass,
              name: this.setGroupName(
                this.params.discipline,
                this.params.groupClass,
                this.params.branch.id,
                this.params.timeFrom,
                this.params.block,
                this.params.ind
              ),
              subject: this.params.discipline.name,
              symbol: this.params.discipline.id,
              teacher: `${this.currentTeacher.LastName} ${this.currentTeacher.FirstName}`,
              teacherId: this.teacherId,
              time: `${this.params.beginTime}-${this.params.endTime}`,
              bumflag: true,
            });
          } else if (response.data.status == 440) {
            this.errorMessage = true;
          }
        }
      } else {
        this.$refs.form.validate();
      }
    },
  },
};
</script>

<style scoped>
v-row .button {
  width: 350px;
}
.button {
  margin-top: 20px;
  justify-content: center;
  background-image: linear-gradient(
    to right,
    rgb(251, 171, 23) 0%,
    rgb(250, 191, 82) 100%
  ) !important;
  width: 100px;
}
.rounded-btn {
  border: 1px solid rgb(214, 214, 216);
  background-image: linear-gradient(
    to bottom,
    rgb(255, 255, 255) 0%,
    rgb(214, 214, 216) 100%
  );
}

.bordered .v-input__slot {
  border: 1px solid #9e9e9e;
}

.rounded-card {
  border-radius: 10px;
}

.rounded-btn-orange {
  background-image: linear-gradient(
    to right,
    rgb(251, 171, 23) 0%,
    rgb(250, 191, 82) 100%
  );
  box-shadow: 0px 5px 5px rgba(196, 197, 197);
}
</style>
