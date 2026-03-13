import type { services } from "@diegopatinodoprr/woter-library";

export class BddDomainAdapter {
  public toConnectRequest(body: unknown): services.IBddConnectRequest {
    return (body ?? {}) as services.IBddConnectRequest;
  }

  public toCreateObjectRequest(body: unknown): services.IBddCreateObjectRequest {
    return body as services.IBddCreateObjectRequest;
  }

  public toCreateObjectsRequest(body: unknown): services.IBddCreateObjectsRequest {
    return body as services.IBddCreateObjectsRequest;
  }

  public toSearchObjectRequest(body: unknown): services.IBddSearchObjectRequest {
    return body as services.IBddSearchObjectRequest;
  }

  public toSearchObjectsRequest(body: unknown): services.IBddSearchObjectsRequest {
    return body as services.IBddSearchObjectsRequest;
  }

  public toUpdateObjectRequest(body: unknown): services.IBddUpdateObjectRequest {
    return body as services.IBddUpdateObjectRequest;
  }

  public toUpdateObjectsRequest(body: unknown): services.IBddUpdateObjectsRequest {
    return body as services.IBddUpdateObjectsRequest;
  }

  public toDeleteObjectRequest(body: unknown): services.IBddDeleteObjectRequest {
    return body as services.IBddDeleteObjectRequest;
  }

  public toDeleteObjectsRequest(body: unknown): services.IBddDeleteObjectsRequest {
    return body as services.IBddDeleteObjectsRequest;
  }

  public toConnectResponse(data: services.IBddConnectResponse): services.IBddConnectResponse {
    return data;
  }

  public toCreateObjectResponse(
    data: services.IBddCreateObjectResponse
  ): services.IBddCreateObjectResponse {
    return data;
  }

  public toCreateObjectsResponse(
    data: services.IBddCreateObjectsResponse
  ): services.IBddCreateObjectsResponse {
    return data;
  }

  public toSearchObjectResponse(
    data: services.IBddSearchObjectResponse
  ): services.IBddSearchObjectResponse {
    return data;
  }

  public toSearchObjectsResponse(
    data: services.IBddSearchObjectsResponse
  ): services.IBddSearchObjectsResponse {
    return data;
  }

  public toUpdateObjectResponse(
    data: services.IBddUpdateObjectResponse
  ): services.IBddUpdateObjectResponse {
    return data;
  }

  public toUpdateObjectsResponse(
    data: services.IBddUpdateObjectsResponse
  ): services.IBddUpdateObjectsResponse {
    return data;
  }

  public toDeleteObjectResponse(
    data: services.IBddDeleteObjectResponse
  ): services.IBddDeleteObjectResponse {
    return data;
  }

  public toDeleteObjectsResponse(
    data: services.IBddDeleteObjectsResponse
  ): services.IBddDeleteObjectsResponse {
    return data;
  }
}
