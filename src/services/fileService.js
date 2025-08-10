import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { storage, db } from "./firebase.js";

class FileService {
  async uploadFile(file, classroomId, userId, userName) {
    try {
      const fileId = `${Date.now()}_${file.name}`;
      const storageRef = ref(
        storage,
        `classrooms/${classroomId}/files/${fileId}`
      );

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save file metadata to Firestore
      const filesRef = collection(db, "classrooms", classroomId, "files");
      const fileData = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        downloadURL: downloadURL,
        storagePath: snapshot.ref.fullPath,
        uploadedBy: userId,
        uploadedByName: userName,
        uploadedAt: serverTimestamp(),
        isActive: true,
      };

      await addDoc(filesRef, fileData);

      return {
        ...fileData,
        uploadedAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getFiles(classroomId) {
    try {
      const filesRef = collection(db, "classrooms", classroomId, "files");
      const q = query(filesRef, orderBy("uploadedAt", "desc"));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch files: ${error.message}`);
    }
  }

  async deleteFile(classroomId, fileDocId, storagePath) {
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);

      // Delete metadata from Firestore
      const fileRef = doc(db, "classrooms", classroomId, "files", fileDocId);
      await deleteDoc(fileRef);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  getFileIcon(fileType) {
    const iconMap = {
      "application/pdf": "fas fa-file-pdf text-red-500",
      "application/msword": "fas fa-file-word text-blue-500",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "fas fa-file-word text-blue-500",
      "application/vnd.ms-excel": "fas fa-file-excel text-green-500",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "fas fa-file-excel text-green-500",
      "application/vnd.ms-powerpoint": "fas fa-file-powerpoint text-orange-500",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "fas fa-file-powerpoint text-orange-500",
      "text/plain": "fas fa-file-alt text-gray-500",
      "image/jpeg": "fas fa-file-image text-purple-500",
      "image/jpg": "fas fa-file-image text-purple-500",
      "image/png": "fas fa-file-image text-purple-500",
      "image/gif": "fas fa-file-image text-purple-500",
      "image/webp": "fas fa-file-image text-purple-500",
    };

    return iconMap[fileType] || "fas fa-file text-gray-500";
  }

  isImageFile(fileType) {
    return fileType && fileType.startsWith("image/");
  }

  isPDFFile(fileType) {
    return fileType === "application/pdf";
  }

  validateFile(file, maxSizeInMB = 10) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "File type not supported. Please upload PDF, Word, Excel, PowerPoint, text, or image files."
      );
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size must be less than ${maxSizeInMB}MB.`);
    }

    return true;
  }
}

export default new FileService();
