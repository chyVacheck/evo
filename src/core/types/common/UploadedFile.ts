/**
 * @file UploadedFile.ts
 * @module core/types
 *
 * @description
 * Строгий брендированный тип файла, загруженного через multipart/form-data.
 */

export type UploadedFile = {
	/**
	 * @description
	 * Имя файла.
	 */
	filename: string;
	/**
	 * @description
	 * МIME-тип файла.
	 */
	mimetype: string;
	/**
	 * @description
	 * Размер файла в байтах.
	 */
	size: number;
	/**
	 * @description
	 * Кодировка файла.
	 */
	encoding: string;
	/**
	 * @description
	 * Буфер данных файла.
	 */
	buffer: Buffer;
};
