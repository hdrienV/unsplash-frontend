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
              <b-form-input class="SearchInput" placeholder="Search by name">
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
      >
        <template v-slot:default="{ item }">
          <div class="Item">
            <div class="content">
              <div class="content-overlay"></div>
              <div class="content-details-button fadeIn-bottom-button">
                <b-button
                  class="content-button float-sm-right"
                  variant="danger"
                >
                  Delete
                </b-button>
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
export interface Image {
  id: bigint;
  label: string;
  url: string;
  date: Date;
}

@Component({
  components: { VueMasonryWall }
})
export default class Home extends Vue {
  public images: Image[] = [];
  containerImage = "";

  options = {
    width: 450,
    padding: {
      default: 12
    }
  };

  append = () => {
    // API call and add items
    this.created();
  };

  private async created() {
    const response = await axios.get("/api/v1/getImages");
    this.images = await response.data;
  }
}
</script>

<style>
@import "../assets/styles/home.css";
</style>
