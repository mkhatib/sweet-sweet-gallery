/**
 * A utility class to create a gallery of images in a grid of rows taking up
 * the full width of the container while respecting the aspect ratio of the
 * images.
 *
 * Usage 1: Initializing in an empty container with list of images.
 *  const images: SweetSweetImage = [{src: ''}, {src: ''}, ...moreImages ];
 *  const container = document.querySelector('.sweet-sweet-gallery');
 *  const gallery = new SweetSweetGallery({images, container});
 *  // To destroy the gallery
 *  gallery.onDestroy();
 *
 * Usage 2: Initializing in a container with images.
 *  const container = document.querySelector('.sweet-sweet-gallery');
 *  const gallery = SweetSweetGallery.initFromContainer(container);
 *  // To destroy the gallery
 *  gallery.onDestroy();
 */

export type SweetSweetImage = {
  src: string;
  srcset: string[];
  sizes: string[];
  alt?: string;
};

export type SweetSweetGalleryOptions = {
  perRowCount?: number;
  gap?: number;
  onClick?: (
    image: SweetSweetImage,
    imageEl: HTMLImageElement,
    index: number
  ) => void;
};

export class SweetSweetGallery {
  images: SweetSweetImage[];
  container: HTMLElement;
  options: SweetSweetGalleryOptions;
  constructor({
    images,
    container,
    options,
  }: {
    images: SweetSweetImage[];
    container: HTMLElement;
    options?: SweetSweetGalleryOptions;
  }) {
    this.images = images;
    this.container = container;
    this.options = options ?? {};
    this.init();
  }

  private init() {
    const imagesConfig: {
      [src: string]: {
        width?: number;
        height?: number;
      };
    } = {};
    const DEFAULT_GAP = 8;
    const DEFAULT_GAP_PER_ROW_COUNT = 4;
    const gap = this.options.gap ?? DEFAULT_GAP;
    const perRowCount = this.options.perRowCount ?? DEFAULT_GAP_PER_ROW_COUNT;
    const rowCount = Math.ceil(this.images.length / perRowCount);
    const rows: HTMLDivElement[] = [];

    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.gap = `${gap}px`;
    for (let i = 0; i < rowCount; i++) {
      const rowEl = document.createElement('div');
      rowEl.style.flexFlow = 'row wrap';
      rowEl.style.display = 'flex';
      rowEl.style.alignItems = 'center';
      rowEl.style.gap = `${gap}px`;
      rows.push(rowEl);
      this.container.appendChild(rowEl);
    }

    const maybeCreateImageElements = () => {
      if (Object.keys(imagesConfig).length !== this.images.length) {
        return;
      }

      const imageElements = this.images.map((image, index) => {
        const imageEl = document.createElement('img');
        imageEl.src = image.src;
        if (image.srcset) imageEl.srcset = image.srcset.join(',');
        if (image.sizes) imageEl.sizes = image.sizes.join(',');
        imageEl.style.top = '0';
        imageEl.style.left = '0';
        imageEl.style.position = 'absolute';
        imageEl.style.width = '100%';
        imageEl.style.height = '100%';
        if (this.options.onClick)
          imageEl.onclick = () => {
            this.options.onClick && this.options.onClick(image, imageEl, index);
          };
        return imageEl;
      });

      imageElements.forEach((imageEl, index) => {
        const imageParentContainer = document.createElement('div');
        const flexValue =
          imagesConfig[imageEl.src].width! / imagesConfig[imageEl.src].height!;
        const paddingValue =
          (imagesConfig[imageEl.src].height! /
            imagesConfig[imageEl.src].width!) *
          100;
        console.log(`${paddingValue}`);
        imageParentContainer.style.flex = `${flexValue} 0%`;
        imageParentContainer.style.width = '30%';
        imageParentContainer.style.alignSelf = 'flex-start';

        const imageWrapper = document.createElement('div');
        imageWrapper.style.paddingBottom = `${paddingValue}%`;
        imageWrapper.style.position = 'relative';
        imageWrapper.style.height = '0';
        imageWrapper.style.overflow = 'hidden';

        imageWrapper.appendChild(imageEl);
        imageParentContainer.appendChild(imageWrapper);
        rows[Math.floor(index / perRowCount)].appendChild(imageParentContainer);
      });
    };

    this.images.forEach(image => {
      const imageEl = new Image();
      imageEl.onload = () => {
        imagesConfig[image.src] = {
          width: imageEl.naturalWidth,
          height: imageEl.naturalHeight,
        };
        maybeCreateImageElements();
      };
      imageEl.src = image.src;
    });
  }

  onDestroy() {
    this.container.textContent = '';
  }

  static initFromContainer(
    container: HTMLElement,
    options?: SweetSweetGalleryOptions
  ) {
    const imgs = Array.from(
      container.querySelectorAll('img')
    ) as HTMLImageElement[];

    const images = imgs.map(img => ({
      src: img.src,
      srcset: img.srcset.split(',').map(s => s.trim()),
      sizes: img.sizes.split(',').map(s => s.trim()),
      alt: img.alt,
    }));

    container.textContent = '';

    const gallery = new SweetSweetGallery({
      images,
      container,
      options,
    });

    return gallery;
  }
}
