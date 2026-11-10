import stores from "~/stores";
import { getPublicLink } from "./PublicAccess";

describe("getPublicLink", () => {
  const parentShare = stores.shares.add({
    id: "parent-share",
    collectionId: "collection-1",
    published: true,
    url: "https://example.com/s/parent",
  });
  const ownShare = stores.shares.add({
    id: "own-share",
    documentId: "published-doc",
    published: true,
    url: "https://example.com/s/own",
  });
  const publishedDocument = stores.documents.add({
    id: "published-doc",
    path: "/doc/published-abc123",
    publishedAt: new Date().toISOString(),
    collectionId: "collection-1",
  });
  const draftDocument = stores.documents.add({
    id: "draft-doc",
    path: "/doc/draft-def456",
    publishedAt: undefined,
    collectionId: "collection-1",
  });

  it("uses the parent's link for a document without a share of its own", () => {
    expect(getPublicLink(publishedDocument, undefined, parentShare)).toEqual({
      share: parentShare,
      url: "https://example.com/s/parent/doc/published-abc123",
    });
  });

  it("prefers the parent's link over the document's own share", () => {
    expect(getPublicLink(publishedDocument, ownShare, parentShare)).toEqual({
      share: parentShare,
      url: "https://example.com/s/parent/doc/published-abc123",
    });
  });

  it("uses the document's own link when no parent is shared", () => {
    expect(getPublicLink(publishedDocument, ownShare, undefined)).toEqual({
      share: ownShare,
      url: "https://example.com/s/own",
    });
  });

  it("does not inherit the parent's link for a draft", () => {
    expect(getPublicLink(draftDocument, undefined, parentShare)).toEqual({
      share: undefined,
      url: "",
    });
  });
});
