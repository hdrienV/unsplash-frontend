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
            <b-button variant="success">add a photo</b-button>
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
                  @click="modalShow = !modalShow"
                >
                  Delete
                </b-button>
                <b-modal
                  ref="my-modal"
                  centered
                  hide-footer
                  title="Suppression"
                  v-model="modalShow"
                >
                  <div class="d-block text-center">
                    <h3>Êtes-vous sûr de vouloir supprimer cette photo ?</h3>
                  </div>
                  <b-button
                    class="mt-3"
                    variant="danger"
                    block
                    @click="hideDeleteModal(item.id).then(getImages())"
                    >Supprimer</b-button
                  >
                  <b-button
                    class="mt-2"
                    variant="outline-secondary"
                    block
                    @click="hideModal"
                    >Annuler</b-button
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
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueMasonryWall from "vue-masonry-wall";
import axios from "axios";
import { BModal } from "bootstrap-vue";
export interface Image {
  id: bigint;
  label: string;
  url: string;
  date: Date;
}

@Component({
  components: { VueMasonryWall, BModal }
})
export default class Home extends Vue {
  public images: Image[] = [];
  containerImage = "";
  modalShow = false;
  componentKey = 0;
  imageNameToSearch = "";

  options = {
    width: 450,
    padding: {
      default: 12
    }
  };

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
  public async hideDeleteModal(id: string) {
    this.modalShow = false;
    await axios.delete("/api/v1/image/" + id);
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
}
</script>

<style>
@import "../assets/styles/home.css";
</style>
