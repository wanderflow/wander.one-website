export default function ScreenFrame({ styles, children }) {
  return (
    <>
      <div className={styles.statusBar}>
        <span className={styles.statusTime}>9:41</span>
        <div className={styles.statusIcons}>
          <span className={styles.signalIcon} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className={styles.wifiIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.batteryIcon} aria-hidden="true">
            <span className={styles.batteryLevel}>80</span>
          </span>
        </div>
      </div>
      {children}
      <div className={styles.homeIndicator} aria-hidden="true" />
    </>
  );
}
