import demoPng from '../../../assets/demo.png';

export default () => (
  <div class="w-1/2 max-w-xs sm:w-48">
    <picture>
      <source srcset={demoPng} type="image/png" alt="Demo Logo" />
      <img src={demoPng} alt="Demo Logo" />
    </picture>
  </div>
);
