CREATE proc [dbo].[Forum_SelectByStatusId]
	@StatusId int,
	@PageSize int = 10,
	@PageNum int = 1,
	@NameFilter nvarchar(50) = null
as
/*
	declare @_statusId int = 1,
		@_pagesize int = 5,
		@_pagenum int = 1,
		@_namefilter nvarchar(50) = null;

	execute Forum_SelectByStatusId @_statusId, @_pagesize, @_pagenum, @_namefilter;
*/
begin
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
		into #temp
	from Forum as F join Forum_Status as FS on F.StatusId = FS.Id join Project as P on F.ProjectId = P.Id

where StatusId = @StatusId and (Name like '%' + @NameFilter + '%' or @NameFilter IS NULL)
order by F.ModifiedDate desc
	offset @PageSize * (@PageNum - 1) rows
	fetch next @PageSize rows only

	Select
		Id,
		StatusId,
		ProjectId,
		Status,
		Name,
		Description,
		CreatedDate,
		ModifiedDate,
		ModifiedBy
		from #temp
		
	select count(1) from Forum as F join Forum_Status as FS on F.StatusId = FS.Id join Project as P on F.ProjectId = P.Id
	 where StatusId = @StatusId and
	 (Name like '%' + @NameFilter + '%' or @NameFilter IS NULL)
	 select 
		f.Id,
		count(1) as Total
	 from Forum_Comments as fc
	 join #temp as t on fc.ForumId = t.Id
	 join Forum as f on t.Id = f.Id 
	 group by f.Id
end