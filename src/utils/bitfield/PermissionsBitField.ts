import { PermissionFlagsBits } from 'discord-api-types/v10';

export type PermissionsCheckType = (keyof typeof PermissionsBitField | bigint | string)[] | keyof typeof PermissionsBitField | bigint | string;

/** Utility class for working with permissions */
class PermissionsBitField {
  ['constructor']: typeof PermissionsBitField;
  bitfield: bigint;
  /**
   * The default bit
   * @private
   */
  static defaultBit: bigint;
  /** Object containing all available permissions */
  static Flags: typeof PermissionFlagsBits;
  constructor(bits: PermissionsCheckType) {
    this.bitfield = this.constructor.parse(bits ?? this.constructor.defaultBit);
  }

  /** Adds bits to these ones */
  add(...bits: PermissionsCheckType[]) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) total |= this.constructor.parse(bit);
    this.bitfield |= BigInt(total);
    return this;
  }

  /** Checks whether the bitfield has a bit, or multiple bits */
  has(bit: PermissionsCheckType) {
    // eslint-disable-next-line no-param-reassign
    bit = this.constructor.parse(bit);
    return (this.bitfield & bit) === bit;
  }

  /** Removes bits from these */
  remove(...bits) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) {
      total |= this.constructor.parse(bit);
    }
    this.bitfield &= ~total;
    return this;
  }

  /** Gets an Array of {@link PermissionFlagsBits} names based on the bits available */
  toArray() {
    return Object.keys(this.constructor.Flags).filter(bit => this.has(bit));
  }

  static parse(bit: PermissionsCheckType): bigint {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return BigInt(bit as bigint);
    if (bit instanceof PermissionsBitField) return bit.bitfield;
    if (Array.isArray(bit)) {
      return bit
        .map(p => this.parse(p))
        .reduce((prev, p) => {
          return BigInt(prev | p);
        }, defaultBit);
    }
    if (typeof bit === 'string') {
      if (typeof this.Flags[bit] !== 'undefined') return this.Flags[bit];
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(bit as unknown as number)) return BigInt(bit);
    }
    throw new TypeError(`Expected bit to be a bigint, string, array or PermissionsBitField`);
  }
}

PermissionsBitField.Flags = PermissionFlagsBits;
PermissionsBitField.defaultBit = 0n;

export { PermissionsBitField };