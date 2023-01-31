# Sweet Sweet Gallery

![Screenshot](screenshot.png)

A zero-dependency tiny utility class to create a gallery of images in a grid of rows taking up
the full width of the container while respecting the aspect ratio of the
images. See `example/index.html` for more details.

**Why is this different from other gallery libraries?**
The main goal of this is to provide a way for photos to take entire container
width while respecting the aspect ratio of the photos and without clipping the
photos themselves. Many other libraries exist but usually provide a cut-off
photos (sometimes based on `object-fit` property) while others fix the height
or width of all images and leaving spaces at the end of rows/columns.

## Adding to project

```
pnpm install sweet-sweet-gallery
```

## Importing in a project

```js
import { SweetSweetGallery } from 'sweet-sweet-gallery';
```

## Usage 1: Initializing in an empty container with list of images.

```js
const images: SweetSweetImage[] = [{ src: '' }, { src: '' }, ...moreImages];
const container = document.querySelector('.sweet-sweet-gallery');
const gallery = new SweetSweetGallery({
  images,
  container,
  options: {
    perRowCount: 4,
    gap: 8,
    onClick: (image: SweetSweetImage, imageEl: HTMLImageElement, index: number) {
      console.log("clicked", image, imageEl, index);
    }
  }
});
// To destroy the gallery
gallery.onDestroy();
```

## Usage 2: Initializing in a container with images.

```js
const container = document.querySelector('.sweet-sweet-gallery');
const gallery = SweetSweetGallery.initFromContainer(
  container,
  {
    perRowCount: 4,
    gap: 8,
    onClick: (image: SweetSweetImage, imageEl: HTMLImageElement, index: number) {
      console.log("clicked", image, imageEl, index);
    }
  });
// To destroy the gallery
gallery.onDestroy();
```

## Usage 3: Using in a React component

```jsx
import { useLayoutEffect, useRef } from 'react';
import { SweetSweetGallery, SweetSweetImage } from 'sweet-sweet-gallery';

export const SweetGallery = ({ photos }: { photos: SweetSweetImage[] }) => {
  const ref = useRef < HTMLDivElement > null;

  useLayoutEffect(() => {
    if (!ref.current) return;

    const gallery = new SweetSweetGallery({
      container: ref.current,
      images: photos,
      options: {
        gap: 8,
        perRowCount: 5,
        onClick: (image, imageEl, index) => {
          console.log('clicked', image, imageEl, index);
        },
      },
    });
    return () => gallery.onDestroy();
  }, [photos]);

  return <div ref={ref}></div>;
};
```

# Contributing

To setup and run the project locally run:

```
pnpm install
pnpm start
```

This will kick off the typescript compiler and watch the files to rebuild when changes happen.

To preview the example, run the following command from the root of the project:

```
npx serve .
```

Then go to `http://localhost:3000/example/`

While both of these commands are running you can make changes to the source code and preview
the changes in the example.

# Credits

Images used in screenshot and examples are from Unsplash.com

# LICENSE

MIT
