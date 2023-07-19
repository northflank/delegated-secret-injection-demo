// ---------------------------------------------------------------------------
// region Request types
// ---------------------------------------------------------------------------

/** Payload of the JWT token sent with the secret fetch request */
export interface JwtPayload {
  /** Project ID of the service/job that makes the request */
  projectId: string;
  /** Object ID of the service/job that makes the request */
  nfObjectId: string;
  /** Object type of the service/job that makes the request */
  nfObjectType: string;
}

// ---------------------------------------------------------------------------
// endregion Request types
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// region Response types
// ---------------------------------------------------------------------------

/** A collection of secrets */
export interface SecretCollection {
  /** Array of secrets */
  secrets: Array<Secret>;
}

/** Represents a secret object for the environment injector */
export type Secret = SecretFile | SecretEnv;

/** Represents an injectable secret environment variable */
export interface SecretEnv {
  /** Secret type tag */
  type: "ENV";
  /** Name of the environment variable */
  key: string;
  /** Value of the environment variable */
  value: string;
}

/** Represents an injectable secret file */
export interface SecretFile {
  /** Secret type tag */
  type: "FILE";
  /**
   * Path of the file to inject.
   * Paths should be absolute and start with `/`. Relative paths will be resoled
   * with respect to the docker image WORKDIR, but are not recommended because
   * the WORKDIR might change unexpectedly between image versions.
   */
  path: string;
  /** Content of the file to inject */
  data: string;
  /**
   * Encoding of data (if base64, data will be decoded first before being written to disk).
   * Defaults to "utf-8".
   */
  encoding?: "utf-8" | "base64";
  /** Specified the owner of the injected secret file (analogous to chown) */
  owner?: SecretFileOwner;
  /** Specified the group of the injected secret file (analogous to chown) */
  group?: SecretFileOwner;
  /** Specified the permissions of the injected secret file (analogous to chomod) */
  permissions?: SecretFilePermissions;
}

/** Specifies the permissions for a injected secret file (analogous to chmode) */
export interface SecretFilePermissions {
  /**
   * Specifies when to set permissions.
   * KeepOrSet won't change permissions if the file already exists.
   * AlwaysSet will always override the permissions.
   */
  policy: "AlwaysSet" | "KeepOrSet";
  /** octal numerical string, or decimal number */
  mode: string | number;
}

/**
 * Specifies the owner/group of a file and when to set it
 *
 * The policy field specifies which user/group should be used and when to set it.
 *   - AlwaysSet** means the owner/group will always be changed after the file has been injected.
 *   - KeepOrSet** means the owner/group will not be changed if the file already existed before injection.
 *   - **Explicit means the owner/group will be specified in the value field. The value field can either the name of the user or its numerical ID.
 *   - **Inherited means the owner/group will be based on the user that the main process is started with.
 */
export type SecretFileOwner =
  | { policy: "AlwaysSetExplicit"; value: string }
  | { policy: "KeepOrSetExplicit"; value: string }
  | { policy: "AlwaysSetInherited" }
  | { policy: "KeepOrSetInherited" };

// ---------------------------------------------------------------------------
// endregion Response types
// ---------------------------------------------------------------------------
