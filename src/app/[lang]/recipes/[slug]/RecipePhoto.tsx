import Image from "next/image";
import styles from "./RecipePhoto.module.css";

export default function RecipePhoto({ img, title }: { img: string; title: string }) {
  return (
    <section className={styles.section}>
      <div className={styles.photoFrame}>
        <Image
          src={img}
          alt={`${title} – dish`}
          fill
          className={styles.photoImg}
          sizes="(max-width: 900px) 100vw, 900px"
        />
      </div>
    </section>
  );
}
