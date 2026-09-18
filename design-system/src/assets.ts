import heroStratosphere from '../generated/assets/hero-stratosphere.webp';
import logo from '../generated/assets/logo.webp';
import logoCircle from '../generated/assets/logo-circle.webp';
import airship3d from '../generated/assets/airship-3d.webp';
import airframe from '../generated/assets/airframe.webp';
import about from '../generated/assets/about.webp';
import product from '../generated/assets/product.webp';
import newsMaterial from '../generated/assets/news-material.webp';
import newsAward from '../generated/assets/news-award.webp';
import newsYtn from '../generated/assets/news-ytn.webp';
import newsKepco from '../generated/assets/news-kepco.webp';

/** Brand images from the live site (static/), inlined as data URLs so they render wherever the bundle loads. */
export interface IcarusImages {
  /** Hero backdrop: Earth's curvature from 130,000 ft, shot from NASA's EXCITE balloon. Credit: NASA/GSFC (Kyle Helson), public domain. */
  heroStratosphere: string;
  /** Header logo: ICARUS airship mark on transparent background (static/bg_rec.png). */
  logo: string;
  /** Footer logo: round mark on white (static/bg-white_circle.ico). */
  logoCircle: string;
  /** 3D airship illustration used in the hero (transparent background). */
  airship3d: string;
  /**
   * Photograph of the platform itself, nose to the left, cut out of its studio background.
   * ANIM B's first scene is this image - the parts are called out on the real aircraft.
   */
  airframe: string;
  /** Animated airship clip used in the About section (square crop works best). */
  about: string;
  /** Envelope-material product photo used in the Product section (square). */
  product: string;
  /** News photo: envelope material development (2025.12.04). */
  newsMaterial: string;
  /** News photo: K-Deeptech award ceremony (2025.10.17). */
  newsAward: string;
  /** News photo: YTN news feature (2025.06.26). */
  newsYtn: string;
  /** News photo: KEPCO startup award (2024.11.14). */
  newsKepco: string;
}

export const images: IcarusImages = {
  heroStratosphere,
  logo,
  logoCircle,
  airship3d,
  airframe,
  about,
  product,
  newsMaterial,
  newsAward,
  newsYtn,
  newsKepco,
};
