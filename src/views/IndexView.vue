<script setup></script>

<template>
  <main>
    <div
      id="carouselExampleCaptions"
      class="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
    >
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="3"
          aria-label="Slide 4"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="/public/image/hinatazaka46.jpg"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ $t('hinatazaka46') }}</h5>
            <p>{{ $t('hinatazaka46detail') }}</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="/public/image/nogizaka46.jpg"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ $t('nogizaka46') }}</h5>
            <p>{{ $t('nogizaka46detail') }}</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="/public/image/sakurazaka46.jpg"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ $t('sakurazaka46') }}</h5>
            <p>{{ $t('sakurazaka46detail') }}</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="/public/image/keyakizaka46.png"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ $t('keyakizaka46') }}</h5>
            <p>{{ $t('keyakizaka46detail') }}</p>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </main>
</template>

<style>
.d-block {
  max-width: 1200px;
  max-height: 633px;
  overflow: hidden;
}
</style>
