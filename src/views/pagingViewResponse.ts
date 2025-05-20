export class PagingViewResponse<T> {
  public static from<T>({ limit, page, rows, total }: { page: number; limit: number; total: number; rows: T[] }): PagingViewResponse<T> {
    return new PagingViewResponse<T>(Number(page), Number(limit), total, rows);
  }

  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly total: number,
    public readonly rows: T[],
  ) {}
}
