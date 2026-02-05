import crypto from 'crypto'

// Document encryption utility using AES-256-GCM
// This provides authenticated encryption, ensuring both confidentiality and integrity

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // 16 bytes for AES
const AUTH_TAG_LENGTH = 16 // 16 bytes for GCM authentication tag
const SALT_LENGTH = 32 // 32 bytes for key derivation salt

// Get encryption key from environment or generate a secure default
function getEncryptionKey(): string {
  const key = process.env.DOCUMENT_ENCRYPTION_KEY
  if (!key) {
    throw new Error('DOCUMENT_ENCRYPTION_KEY environment variable is required for document encryption')
  }
  return key
}

// Derive a secure key from the master key using PBKDF2
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256')
}

/**
 * Encrypts a buffer using AES-256-GCM
 * Returns: Salt (32 bytes) + IV (16 bytes) + Auth Tag (16 bytes) + Encrypted Data
 */
export function encryptDocument(data: Buffer): Buffer {
  const masterKey = getEncryptionKey()

  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)

  // Derive key from master key
  const key = deriveKey(masterKey, salt)

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  // Encrypt data
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])

  // Get authentication tag
  const authTag = cipher.getAuthTag()

  // Combine: salt + iv + authTag + encrypted data
  return Buffer.concat([salt, iv, authTag, encrypted])
}

/**
 * Decrypts a buffer that was encrypted with encryptDocument
 * Expects format: Salt (32 bytes) + IV (16 bytes) + Auth Tag (16 bytes) + Encrypted Data
 */
export function decryptDocument(encryptedData: Buffer): Buffer {
  const masterKey = getEncryptionKey()

  // Extract components
  const salt = encryptedData.subarray(0, SALT_LENGTH)
  const iv = encryptedData.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const authTag = encryptedData.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH)
  const data = encryptedData.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH)

  // Derive key from master key
  const key = deriveKey(masterKey, salt)

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  // Decrypt data
  return Buffer.concat([decipher.update(data), decipher.final()])
}

/**
 * Check if a file appears to be encrypted (has our encryption header structure)
 * This is a heuristic check - encrypted files start with random bytes
 */
export function isEncryptedFile(data: Buffer): boolean {
  // Our encrypted files have a minimum size of salt + iv + authTag
  const minSize = SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  return data.length >= minSize
}

/**
 * Generate a secure encryption key (use this to generate DOCUMENT_ENCRYPTION_KEY)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Simple string encryption for settings (like SMTP password)
const SETTINGS_ALGORITHM = 'aes-256-cbc'
const SETTINGS_KEY_LENGTH = 32
const SETTINGS_IV_LENGTH = 16

function getSettingsKey(): Buffer {
  const key = process.env.SETTINGS_ENCRYPTION_KEY || process.env.DOCUMENT_ENCRYPTION_KEY || 'default-key-change-in-production'
  // Ensure key is exactly 32 bytes
  return crypto.createHash('sha256').update(key).digest()
}

/**
 * Encrypt a string (for storing sensitive settings like SMTP password)
 */
export function encrypt(text: string): string {
  const key = getSettingsKey()
  const iv = crypto.randomBytes(SETTINGS_IV_LENGTH)
  const cipher = crypto.createCipheriv(SETTINGS_ALGORITHM, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  // Return IV + encrypted data as hex
  return iv.toString('hex') + ':' + encrypted
}

/**
 * Decrypt a string (for reading sensitive settings like SMTP password)
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getSettingsKey()
    const parts = encryptedText.split(':')
    if (parts.length !== 2) {
      // Not encrypted, return as-is (for backwards compatibility)
      return encryptedText
    }
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    const decipher = crypto.createDecipheriv(SETTINGS_ALGORITHM, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    // If decryption fails, return the original (might be unencrypted)
    console.error('Decryption failed:', error)
    return encryptedText
  }
}
