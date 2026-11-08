import styles from './index.module.css';
import { A } from '@solidjs/router';
import { type JSX } from 'solid-js/jsx-runtime';

export default function (): JSX.Element {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <p>
          <A href='/about'>about</A>
        </p>
        <p>
          <A href='/test/hoge'>test</A>
        </p>
      </header>
    </div>
  );
}
