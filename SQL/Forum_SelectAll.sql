CREATE proc [dbo].[Forum_SelectAll]
	@PageSize int = 10,
	@PageNum int = 1,
	@NameFilter nvarchar(50) = null
as
/*
	declare
		@_pagesize int = 8,
		@_pagenum int = 1,
		@_namefilter nvarchar(50) = "Tims"

	execute 
		Forum_SelectAll @_pagesize, @_pagenum, @_namefilter
*/
begin
	; with CTE_Results as
	(
	Select 
		F.Id,
		FS.Id as StatusId,
		F.ProjectId,
		FS.Description as Status,
		P.Name,
		P.Description,
		F.CreatedDate,
		F.ModifiedDate,
		F.ModifiedBy
	from Forum as F join Forum_Status as FS on F.StatusId = FS.Id join Project as P on F.ProjectId = P.Id
	where (Name like '%' + @NameFilter + '%' or @NameFilter IS NULL)
	order by F.ModifiedDate desc
	offset @PageSize * (@PageNum - 1) rows
	fetch next @PageSize rows only
	)
	Select
		t.Id,
		t.StatusId,
		t.ProjectId,
		t.Status,
		t.Name,
		t.Description,
		t.CreatedDate,
		t.ModifiedDate,
		t.ModifiedBy
		from CTE_Results as t
		where exists(select 1 from cte_results where cte_results.Id = t.Id)
	OPTION (RECOMPILE)
	select count(1) from Forum as F join Forum_Status as FS on F.StatusId = FS.Id join Project as P on F.ProjectId = P.Id
	 where
	 (Name like '%' + @NameFilter + '%' or @NameFilter IS NULL)
	
end
