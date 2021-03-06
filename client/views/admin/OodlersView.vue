<template>
  <div id="oodlersView">
    <flash-message v-if="flashMessage" @dismissed="dismissed" :message="flashMessage" :type="flashType" ></flash-message>
    <div class="header page-header">
      <div class="row">
        <div class="col-md-3">
          <h1 class="text-info">Users</h1>
        </div>
        <div class="add-button col-md-offset-8 col-md-1">
          <button class="btn btn-block btn-success" data-toggle="modal" data-target="#newOodler"><span class="glyphicon glyphicon-plus"></span> Add</button>
        </div>
      </div>
    </div>
    <div class="row">
        <search-bar class="col-md-12" subject="user by first name, last name or office" @searchBarUpdate="searchBarUpdate"></search-bar>
    </div>
    <div class="row filtered-oodlers">
      <div v-for="oodler in filteredOodlers" :key="oodler.id" class="col-md-3">
        <oodler-edit-tile @oodlerUpdate="load" :oodler="oodler"></oodler-edit-tile>
      </div>
    </div>
    <div class="modal fade" data-backdrop="static" data-keyboard="false" id="newOodler">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Add new user</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <form class="form-horizontal col-md-10 col-md-offset-1">
                <fieldset>
                  <div class="form-group">
                    <input v-model="newOodler.email" type="email" class="form-control" placeholder="Email">
                  </div>
                  <div class="form-group">
                    <input v-model="newOodler.firstName" type="text" class="form-control" placeholder="First Name">
                  </div>
                  <div class="form-group">
                    <input v-model="newOodler.lastName" type="text" class="form-control" placeholder="Last Name">
                  </div>
                  <div class="form-group">
                    <input v-model="newOodler.office" type="text" class="form-control" placeholder="Office">
                  </div>
                  <div class="form-group">
                    <div class="radio">
                      <label>
                        <input v-model="newOodler.scope" type="radio" value="user">
                        User
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input v-model="newOodler.scope" type="radio" value="admin">
                        Administrator
                      </label>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" data-dismiss="modal" @click="save">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sortBy from 'lodash/sortBy';

  import FlashMessage from '../../components/common/FlashMessage.vue';
  import OodlerEditTile from '../../components/admin/OodlerEditTile.vue';
  import SearchBar from '../../components/common/SearchBar.vue';

  export default{
    data() {
      return {
        searchString: '',
        oodlers: [],
        flashMessage: '',
        flashType: '',
        newOodler: {
          firstName: '',
          lastName: '',
          email: '',
          office: '',
          scope: 'user'
        }
      };
    },
    computed: {
      appInitialized() {
        return this.$store.getters.appInitialized;
      },
      filteredOodlers() {
        if (this.searchString.length < 1) {
          return this.oodlers;
        }

        const searchString = this.searchString.toLowerCase();
        return this.oodlers.filter(oodler => `${oodler.firstName} ${oodler.lastName} ${oodler.office}`
          .toLowerCase()
          .includes(searchString));
      }
    },
    watch: {
      appInitialized() {
        this.load();
      }
    },
    methods: {
      searchBarUpdate(query) {
        this.searchString = query;
      },
      load() {
        this.$http.get('/oodler').then(response => {
          this.oodlers = sortBy(response.body, 'lastName');
        });
      },

      // TODO: Refactor and solve this mess :O
      save() {
        this.$http.post('/oodler', this.newOodler).then(
          () => {
            Object.keys(this.newOodler).forEach(property => {
              this.newOodler[property] = '';
            });
            this.newOodler.scope = 'user';
            this.flashMessage = 'Success! New user added!';
            this.flashType = 'success';
            this.load();
          },
          response => {
            Object.keys(this.newOodler).forEach(property => {
              this.newOodler[property] = '';
            });
            this.newOodler.scope = 'user';
            this.flashMessage = response.body;
            this.flashType = 'danger';
            this.load();
          });
      },
      dismissed() {
        this.flashMessage = '';
      }
    },
    beforeCreate() {
      if (this.$store.getters.oodler.scope === 'user') {
        this.$router.replace({ path: '/' });
      }
    },
    mounted() {
      if (this.appInitialized) {
        this.load();
      }
    },
    components: {
      SearchBar,
      OodlerEditTile,
      FlashMessage
    }
  };
</script>

<style lang="scss" scoped>
  #oodlersView {
    .page-header {
      margin: 0 0 10px;

      h1,
      .add-button {
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }

    .filtered-oodlers {
      padding-left: 0;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;

      .oodler-edit-tile {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }
    }
  }
</style>
