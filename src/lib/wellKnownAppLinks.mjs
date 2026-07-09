const APP_ID = "KCFAZK9C68.one.wander";
const ANDROID_PACKAGE_NAME = "com.wander.one.app";
const ANDROID_SHA256_CERT_FINGERPRINTS = [
  "38:DC:C0:C2:87:AE:46:2A:00:09:F2:0F:52:23:53:79:6A:61:48:54:90:0B:C4:1A:56:BF:32:84:AD:E0:81:BF",
  "5A:02:C4:A2:28:86:30:04:50:C3:C1:A0:60:D0:E0:90:59:39:DC:93:2D:DE:26:ED:4E:61:5B:C4:D4:27:A0:13",
];

function normalizeHost(host) {
  return String(host || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function shouldEnableAppLinks(host) {
  return normalizeHost(host) === "links.wander.one";
}

export function buildAppleAppSiteAssociation(host) {
  return {
    applinks: {
      apps: [],
      details: shouldEnableAppLinks(host)
        ? [
            {
              appID: APP_ID,
              paths: ["/share/*"],
            },
          ]
        : [],
    },
  };
}

export function buildAndroidAssetLinks(host) {
  if (!shouldEnableAppLinks(host)) return [];
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE_NAME,
        sha256_cert_fingerprints: ANDROID_SHA256_CERT_FINGERPRINTS,
      },
    },
  ];
}
