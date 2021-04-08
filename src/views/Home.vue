<template>
  <div>
    <section class="box-container">
      <b-container fluid>
        <b-row style="margin-bottom: 20px">
          <b-col sm="3">
            <div class="user-container">
              <font-awesome-icon icon="user" class="user-icon" />
              <span class="inline-b"
                ><h6 class="str-no-margin">My Unsplash</h6>
                devchallenges.io</span
              >
            </div>
          </b-col>
          <b-col class="form-group has-search" sm="3">
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">
                  <font-awesome-icon icon="search" />
                </span>
              </b-input-group-prepend>
              <b-form-input
                class="SearchInput"
                placeholder="Search by name"
                v-model="imageNameToSearch"
                v-on:change="searchImage"
              >
              </b-form-input>
            </b-input-group>
          </b-col>
          <b-col offset-sm="3" sm="3">
            <b-button variant="success" @click="modalShowAdd = !modalShowAdd"
              >add a photo</b-button
            >
          </b-col>
        </b-row>
      </b-container>
      <vue-masonry-wall
        :items="images"
        :options="{ width: 450, padding: 12 }"
        @append="append"
        :key="componentKey"
      >
        <template v-slot:default="{ item }">
          <div class="Item">
            <div class="content">
              <div class="content-overlay"></div>
              <div class="content-details-button fadeIn-bottom-button">
                <b-button
                  class="content-button float-sm-right"
                  variant="danger"
                  @click="showDelete(item.id)"
                >
                  Delete
                </b-button>
                <b-modal
                  ref="my-modal-delete"
                  centered
                  hide-footer
                  title="Delete"
                  v-model="modalShow"
                >
                  <div class="d-block text-center">
                    <h3>Are you sure to delete this photo ?</h3>
                  </div>
                  <b-button
                    class="mt-3"
                    variant="danger"
                    :id="item.id"
                    block
                    @click="hideDeleteModal().then(getImages())"
                    >Delete</b-button
                  >
                  <b-button
                    class="mt-2"
                    variant="outline-secondary"
                    block
                    @click="hideModal"
                    >Cancel</b-button
                  >
                </b-modal>
              </div>
              <div class="content-details fadeIn-bottom">
                <h5 class="content-title">{{ item.label }}</h5>
              </div>
              <img :src="item.url" />
            </div>
          </div>
        </template>
      </vue-masonry-wall>
      <b-modal
        ref="my-modal-add"
        centered
        hide-footer
        title="Add a new photo"
        v-model="modalShowAdd"
      >
        <div class="d-block">
          <validation-observer v-slot="{ invalid }">
            <b-form v-on:submit="addPhoto">
              <validation-provider
                v-slot="{ errors, valid }"
                name="Label"
                rules="required|max:20"
              >
                <b-form-group label="Label: ">
                  <b-form-input
                    v-model="form.label"
                    placeholder="Enter Label"
                    required
                    type="text"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="valid">
                    <span v-for="(error, index) in errors" :key="index">{{
                      error
                    }}</span>
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
              <validation-provider
                v-slot="{ errors, valid }"
                name="Photo URL"
                rules="required"
              >
                <b-form-group label="Photo URL:">
                  <b-form-input
                    placeholder="Enter photo URL"
                    v-model="form.url"
                    required
                    type="url"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="valid">
                    <span v-for="(error, index) in errors" :key="index">{{
                      error
                    }}</span>
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
              <b-button
                variant="success"
                class="text-right"
                type="submit"
                :disabled="invalid"
                >Add photo</b-button
              >
            </b-form>
          </validation-observer>
        </div>
      </b-modal>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueMasonryWall from "vue-masonry-wall";
import axios from "axios";
import { BModal } from "bootstrap-vue";
import { extend, ValidationProvider, ValidationObserver } from "vee-validate";
import { required, max } from "vee-validate/dist/rules";
export interface Image {
  id: bigint;
  label: string;
  url: string;
  date: Date;
}

extend("required", {
  ...required,
  message: "You may not left {_field_} empty"
});
extend("max", {
  ...max,
  message: "{_field_} should not exceed {length} characters"
});

@Component({
  components: { VueMasonryWall, BModal, ValidationProvider, ValidationObserver }
})
export default class Home extends Vue {
  public images: Image[] = [];
  containerImage = "";
  modalShow = false;
  modalShowAdd = false;
  componentKey = 0;
  imageNameToSearch = "";
  idToDelete = 0;

  options = {
    width: 450,
    padding: {
      default: 12
    }
  };

  form = {
    label: "",
    url: ""
  };

  errors = {};

  mounted = () => {
    // API call and add items
    this.created();
  };

  append = () => {
    console.log("append");
  };

  private async created() {
    this.getImages();
    console.log("created");
  }
  public async hideDeleteModal() {
    this.modalShow = false;
    await axios.delete("/api/v1/image/" + this.idToDelete);
    await this.getImages();
    this.forceRerender();
  }
  public async searchImage() {
    if (this.imageNameToSearch != "") {
      const response = await axios.get(
        "/api/v1/image/search?label=" + this.imageNameToSearch
      );
      this.images = await response.data;
      this.forceRerender();
    } else {
      this.getImages();
    }
  }
  public hideModal(): void {
    this.modalShow = false;
  }
  public async getImages() {
    const response = await axios.get("/api/v1/image");
    this.images = await response.data;
  }

  public forceRerender() {
    this.componentKey += 1;
  }

  public showDelete(id: number) {
    this.modalShow = true;
    this.idToDelete = id;
  }

  public async addPhoto(e: { preventDefault: () => void }) {
    e.preventDefault();
    await axios.post("/api/v1/image/", this.form);
    await this.getImages();
    this.form = {
      label: "",
      url: ""
    };
    this.modalShowAdd = false;
    this.forceRerender();
  }
}
</script>

<style>
@import "../assets/styles/home.css";
</style>
