import { Request, RequestIdentifier, RequestProps } from "../structures/request";
import { DocumentScheme } from "./documents/document-scheme";
import { RequestDocument } from "./documents/request-document";
import { User } from "../structures/user";
import { ContextModel } from "../context/context-model";
import { firestore } from "firebase-admin";
import { db } from "~/firebase";
import { UserDocument } from "~/models/repositories/documents/user-document";

export class RequestRepository extends ContextModel {
  public build(snapshot: firestore.DocumentSnapshot): Request | null {
    if (!snapshot?.exists) return null;
    const doc = snapshot.data() as RequestDocument;
    return new Request(this.context, { ...this.toProps(doc), ...this.toIdentifier(snapshot) });
  }

  public buildFirst(snapshot: firestore.QuerySnapshot): Request | null {
    if (snapshot.empty) return null;
    return this.build(snapshot.docs[0]);
  }

  private static getDocumentReference(request: Request) {
    return DocumentScheme.request(request.target.id, request.id);
  }

  private toIdentifier(snapshot: firestore.DocumentSnapshot): RequestIdentifier {
    return {
      id: snapshot.id,
      target: new User(this.context, { id: snapshot.ref.id })
    };
  }

  private toProps(doc: RequestDocument): RequestProps {
    return {
      content: doc.content,
      requester: new User(this.context, { id: doc.requesterUserId }),
      index: doc.index
    };
  }

  private static toDocument(props: RequestProps): RequestDocument {
    return {
      content: props.content,
      requesterUserId: props.requester.id,
      index: props.index
    };
  }

  async getById(userId: string, requestId: string): Promise<Request | null> {
    const snapshot = await DocumentScheme.request(userId, requestId).get();
    return this.build(snapshot);
  }

  public async getByIndex(index: number): Promise<Request | null> {
    const snapshot = await DocumentScheme.requests(this.context.clientUser.id).where("index", "==", index).get();
    return this.repositories.requests.buildFirst(snapshot);
  }

  async create(props: CreateProps): Promise<Request> {
    const requestDocRef = await db.runTransaction(async (transaction) => {
      const userSnapshot = await transaction.get(DocumentScheme.user(props.target.id));
      if (!userSnapshot?.exists) throw Error();
      const userDoc = userSnapshot.data() as UserDocument;
      const requestDoc = RequestRepository.toDocument({ ...props, index: userDoc.requestIndex });
      const requestDocRef = DocumentScheme.requests(props.target.id).doc();
      transaction.create(requestDocRef, requestDoc);
      return requestDocRef;
    });
    return new Request(this.context, {
      ...props,
      id: requestDocRef.id
    });
  }

  async delete(request: Request) {
    await RequestRepository.getDocumentReference(request).delete();
  }
}

type CreateProps = Omit<RequestProps, "index"> & {
  target: User;
};
